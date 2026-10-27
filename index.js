import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import pino from 'pino';
import { config } from './config.js';
import { handleMessage } from './handlers/commands.js';

const logger = pino({ level: 'silent' });
const pairingPhone = String(process.env.PAIRING_PHONE || '').replace(/\D/g, '');
let reconnectTimer;
let currentSocket;

function errorSummary(error) {
  return {
    statusCode: error?.output?.statusCode ?? null,
    message: error?.message ?? String(error ?? 'unknown'),
    reason: error?.output?.payload?.error ?? null
  };
}

async function start() {
  if (pairingPhone && (pairingPhone.length < 8 || pairingPhone.length > 15)) {
    throw new Error('PAIRING_PHONE must be an international number, 8 to 15 digits, without +.');
  }

  const { state, saveCreds } = await useMultiFileAuthState(config.authDirectory);
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

    if (qr && !state.creds.registered && pairingPhone && !pairingRequested) {
      pairingRequested = true;
      try {
        const code = await sock.requestPairingCode(pairingPhone);
        if (!closed) {
          console.log('WhatsApp pairing code: ' + code);
          console.log('WhatsApp > Linked devices > Link a device > Link with phone number instead.');
        }
      } catch (error) {
        console.error('Pairing-code request failed:', errorSummary(error));
      }
    }

    if (connection === 'open') {
      console.log('🐉 Dragon Bot connected.');
    }

    if (connection === 'close') {
      closed = true;
      const details = errorSummary(lastDisconnect?.error);
      console.error('WhatsApp connection closed:', details);
      try { sock.ws?.close(); } catch { /* Already closed */ }

      if (details.statusCode === DisconnectReason.loggedOut) {
        console.error('WhatsApp rejected or logged out this session. Check auth files and pairing; do not delete auth automatically.');
        return;
      }

      if (!reconnectTimer) {
        console.log('Reconnecting in 3 seconds...');
        reconnectTimer = setTimeout(() => {
          reconnectTimer = undefined;
          start().catch(error => console.error('Reconnect failed:', error));
        }, 3000);
      }
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (closed || currentSocket !== sock) return;
    console.log('[messages.upsert]', { type, count: messages?.length ?? 0 });
    for (const message of messages || []) {
      if (!message.message) {
        console.log('[message skipped] empty content');
        continue;
      }
      if (message.key.fromMe) {
        console.log('[message skipped] sent by bot account');
        continue;
      }
      const content = message.message.ephemeralMessage?.message || message.message;
      const body = content?.conversation || content?.extendedTextMessage?.text ||
        content?.viewOnceMessage?.message?.conversation || '';
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
