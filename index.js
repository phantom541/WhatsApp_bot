import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import pino from 'pino';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { config } from './config.js';
import { handleMessage } from './handlers/commands.js';
import { updateDatabase } from './lib/database.js';
import { expireWorld } from './lib/world-events.js';

const logger = pino({ level: 'silent' });
let currentSocket;
let reconnectTimer;
let worldMaintenanceTimer;
let pairingPhone = String(process.env.PAIRING_PHONE || '').replace(/\D/g, '');

async function getPairingPhone() {
  if (!pairingPhone) {
    if (!stdin.isTTY) {
      throw new Error('Set PAIRING_PHONE to your WhatsApp number in international format (digits only) for initial pairing.');
    }
    const rl = createInterface({ input: stdin, output: stdout });
    try {
      pairingPhone = (await rl.question('WhatsApp number to link (country code, no +): ')).replace(/\D/g, '');
    } finally {
      rl.close();
    }
  }
  if (!/^\d{8,15}$/.test(pairingPhone)) {
    throw new Error('PAIRING_PHONE must contain 8 to 15 digits, including country code.');
  }
  return pairingPhone;
}

function statusCode(error) {
  return error?.output?.statusCode ?? null;
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  console.log('Reconnecting in 3 seconds...');
  reconnectTimer = setTimeout(() => {
    reconnectTimer = undefined;
    start().catch(error => {
      console.error('Reconnect failed:', error);
      scheduleReconnect();
    });
  }, 3000);
}

function startWorldMaintenance(sock) {
  if (worldMaintenanceTimer) return;
  worldMaintenanceTimer = setInterval(async () => {
    if (currentSocket !== sock) return;
    try {
      const events = await updateDatabase(db => expireWorld(db));
      for (const event of events) {
        if (event.group?.endsWith('@g.us')) {
          await sock.sendMessage(event.group, { text: event.text });
        }
      }
    } catch (error) {
      console.error('Group world-event maintenance failed:', error?.message || error);
    }
  }, 15000);
  worldMaintenanceTimer.unref?.();
}

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(config.authDirectory);
  // Once linked, saved credentials are reused. A pairing code is needed only
  // when the WhatsApp account is not registered on this device.
  const phone = state.creds.registered ? null : await getPairingPhone();
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    auth: state,
    version,
    logger,
    browser: ['Ubuntu', 'Chrome', '120.0.0'],
    printQRInTerminal: false
  });
  currentSocket = sock;
  sock.ev.on('creds.update', saveCreds);

  let pairingRequested = false;
  let closed = false;

  sock.ev.on('connection.update', async ({ connection, qr, lastDisconnect }) => {
    if (closed || currentSocket !== sock) return;

    if (qr && !state.creds.registered && phone && !pairingRequested) {
      pairingRequested = true;
      try {
        const code = await sock.requestPairingCode(phone);
        if (!closed) {
          console.log('WhatsApp phone-number pairing code: ' + code);
          console.log('On your phone: WhatsApp > Linked devices > Link a device > Link with phone number instead.');
        }
      } catch (error) {
        console.error('Phone-number pairing request failed:', error?.message || error);
      }
    }

    if (connection === 'open') {
      console.log('🐉 Dragon Bot connected using saved WhatsApp linked-device credentials.');
      console.log('Command prefix:', JSON.stringify(config.prefix));
      startWorldMaintenance(sock);
    }

    if (connection === 'close') {
      closed = true;
      if (worldMaintenanceTimer) {
        clearInterval(worldMaintenanceTimer);
        worldMaintenanceTimer = undefined;
      }
      const code = statusCode(lastDisconnect?.error);
      console.error('WhatsApp connection closed:', code, lastDisconnect?.error?.message || '');
      if (currentSocket === sock) currentSocket = undefined;
      try { sock.ws?.close(); } catch { /* Already closed */ }

      if (code === DisconnectReason.loggedOut || code === DisconnectReason.badSession) {
        console.error('WhatsApp unlinked this device. Saved auth was preserved; relinking may be required.');
        return;
      }
      if (code === DisconnectReason.connectionReplaced) {
        console.error('Another WhatsApp connection replaced this session. Not reconnecting to avoid conflicts.');
        return;
      }
      scheduleReconnect();
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (closed || currentSocket !== sock) return;
    console.log('[messages.upsert]', { type, count: messages?.length ?? 0 });
    for (const message of messages || []) {
      if (!message.message || message.key.fromMe) continue;
      const content = message.message.ephemeralMessage?.message || message.message;
      const body = content?.conversation || content?.extendedTextMessage?.text || '';
      console.log('[message received]', {
        chatType: message.key.remoteJid?.endsWith('@g.us') ? 'group' : 'direct',
        text: body.slice(0, 80),
        commandPrefixMatch: body.startsWith(config.prefix)
      });
      try {
        await handleMessage(sock, message);
        console.log('[message processed]');
      } catch (error) {
        console.error('Message handler failed:', error);
      }
    }
  });
}

start().catch(error => console.error('Bot startup failed:', error));
