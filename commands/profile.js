import {readDatabase} from '../lib/database.js';
import {roleOf} from '../lib/roles.js';
import {riderTitle,riderXpNeeded,RIDER_LEVEL_CAP} from '../lib/rider-progression.js';
export default {name:'profile',description:'View decorated rider identity, titles and progression',async execute({sender,phone,reply,prefix}){
 const db=await readDatabase(),p=db.players[sender];
 if(!p)return reply('Register first with '+prefix+'register');
 const level=Math.max(1,Math.min(RIDER_LEVEL_CAP,Number(p.riderLevel)||1));
 const safe=v=>String(v||'Unknown').replace(/[\r\n*_`~]/g,'').slice(0,36);
 return reply('🐉 *DRAGON BOT | RIDER ID*\n━━━━━━━━━━━━━━━━\n' +
 '🪪 Name: '+safe(p.whatsappName||'Dragon Rider')+'\n' +
 '🔰 Rider ID: '+safe(p.playerId||'Unassigned')+'\n' +
 '🏷️ Title: '+riderTitle(level)+'\n' +
 '🛡️ Role: '+roleOf(db,phone)+'\n' +
 '⭐ Rider Level: '+level+'/'+RIDER_LEVEL_CAP+'\n' +
 (level===RIDER_LEVEL_CAP?'✨ Ascension unlocked • XP: '+(p.ascensionXp||0):'📈 Rider XP: '+(p.riderXp||0)+'/'+riderXpNeeded(level))+'\n' +
 '🐲 Dragon level: '+(p.level||1)+' | XP: '+(p.xp||0)+'\n' +
 '🪙 Pouch: '+(p.coins||0)+'\n' +
 '🐉 Dragons: '+(p.dragons?.length||0)+'\n━━━━━━━━━━━━━━━━');
}};
