import {updateDatabase} from './lib/database.js';
import {expireWorld,world,COLOSSUS_INTERVAL,createSpawn} from './lib/world-events.js';
import {sendColossusMessage} from './lib/colossus-images.js';
import {createColossus} from './lib/colossi.js';
import {expireInvites} from './lib/pvp.js';
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
  // Optional phone pairing for a single-device Termux setup.
  // Leave PAIRING_PHONE unset to use the existing QR login flow.
  const pairingPhone = String(process.env.PAIRING_PHONE || '').replace(/\D/g, '');
  if (!state.creds.registered && pairingPhone) {
    if (pairingPhone.length < 8 || pairingPhone.length > 15) {
      throw new Error('PAIRING_PHONE must contain an international phone number without + or spaces.');
    }
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(pairingPhone);
        console.log('WhatsApp pairing code: ' + code);
        console.log('On WhatsApp: Linked devices > Link a device > Link with phone number instead.');
      } catch (error) {
        console.error('Could not request pairing code:', error?.message || error);
      }
    }, 2000);
  }
  const ticker=setInterval(async()=>{try{const events=await updateDatabase(db=>{const now=Date.now(),messages=[...expireWorld(db,now),...expireInvites(db,now)],w=world(db);if(!w.lastColossusAt)w.lastColossusAt=now;if(now-w.lastColossusAt>=COLOSSUS_INTERVAL){w.lastColossusAt=now;const groups=Object.keys(w.knownGroups||{}).filter(g=>!w.spawns[g]&&!w.battles[g]);if(groups.length){const group=groups[Math.floor(Math.random()*groups.length)],b=createColossus();if(createSpawn(db,group,b,null,false,now))messages.push({group,beast:b,text:'🌌 COLOSSAL ANOMALY: '+b.species+' has appeared! Defeat it to claim it. Use _catch to battle.'})}}return messages});for(const e of events){if(e.beast)await sendColossusMessage(sock,e.group,e.beast,e.text);else await sock.sendMessage(e.group,{text:e.text})}}catch(error){console.error('World timer failed',error)}},10000);
  sock.ev.on('connection.update',({connection})=>{if(connection==='close')clearInterval(ticker)});
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
