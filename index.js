import {updateDatabase} from './lib/database.js';
import {expireWorld,world,COLOSSUS_INTERVAL,createSpawn} from './lib/world-events.js';
import {createColossus} from './lib/colossi.js';
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
  const ticker=setInterval(async()=>{try{const events=await updateDatabase(db=>{const now=Date.now(),messages=expireWorld(db,now),w=world(db);if(!w.lastColossusAt)w.lastColossusAt=now;if(now-w.lastColossusAt>=COLOSSUS_INTERVAL){w.lastColossusAt=now;const groups=Object.keys(w.knownGroups||{}).filter(g=>!w.spawns[g]&&!w.battles[g]);if(groups.length){const group=groups[Math.floor(Math.random()*groups.length)],b=createColossus();if(createSpawn(db,group,b,null,false,now))messages.push({group,text:'🌌 COLOSSAL ANOMALY: '+b.species+' has appeared! Defeat it to claim it. Use _catch to battle.'})}}return messages});for(const e of events)await sock.sendMessage(e.group,{text:e.text})}catch(error){console.error('World timer failed',error)}},10000);
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
