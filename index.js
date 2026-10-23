import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import { config } from './config.js';
import { handleMessage } from './handlers/commands.js';
const logger = pino({ level: 'silent' });
async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(config.authDirectory);
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({ auth: state, version, logger, printQRInTerminal: true });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const message of messages) {
      if (!message.message || message.key.fromMe) continue;
      await handleMessage(sock, message);
    }
  });
  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') console.log('🐉 Dragon Bot connected.');
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) return console.error('Logged out. Pair again.');
      console.log('Reconnecting in 3 seconds...');
      setTimeout(() => start().catch(console.error), 3000);
    }
  });
}
start().catch(console.error);
