import {readDatabase} from '../lib/database.js';
import {groupId,world} from '../lib/world-events.js';
import {activeDragon} from '../lib/collection.js';
import {ensureMoves} from '../lib/moves.js';
export default {name:'battle',requiresStarter:true,description:'Show battle actions or moves/items',async execute({sender,reply,args,prefix,message}){
 const db=await readDatabase(),p=db.players[sender],group=groupId(message?.key?.remoteJid),pvp=group&&world(db).battles[group]?.kind==='pvp'&&[world(db).battles[group].player,world(db).battles[group].opponent].includes(sender);
 if(!pvp&&!p.activeEncounter&&!p.dungeonBattle)return reply('No active encounter. Use '+prefix+'hunt or '+prefix+'dungeon next.');
 const action=(args[0]||'').toLowerCase();
 if(pvp&&action==='item')return reply('Items are not available during PvP.');
 if(action==='item')return reply('🎒 Use '+prefix+'bag to see supplies, then '+prefix+'use potion or '+prefix+'use guardtonic. Using an item ends your turn.');
 if(action==='fight'){
  const d=activeDragon(p);
  if(!d)return reply('No healthy dragon. Use '+prefix+'flee then '+prefix+'rest.');
  ensureMoves(d);
  return reply('⚔️ *'+d.species+' moves*\n'+d.moves.map((m,i)=>(i+1)+'. '+m.name+' | '+m.type+' | Power '+m.power+' | Accuracy '+m.accuracy+'%').join('\n')+'\n\nUse '+prefix+'battlefight [move number]');
 }
 return reply('⚔️ *Battle options*\n'+prefix+'battle fight - show moves\n'+prefix+'battle item - view bag\n'+prefix+'flee - forfeit\n'+prefix+'swap 2 - swap dragons (ends turn)');
}};
