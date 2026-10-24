import {readDatabase} from '../lib/database.js';
import {activeDragon} from '../lib/collection.js';
import {ensureMoves} from '../lib/moves.js';
export default {name:'battle',requiresStarter:true,description:'Show battle actions or moves/items',async execute({sender,reply,args,prefix}){
 const p=(await readDatabase()).players[sender];
 if(!p.activeEncounter)return reply('No active encounter. Use '+prefix+'hunt.');
 const action=(args[0]||'').toLowerCase();
 if(action==='item')return reply('🎒 Use '+prefix+'bag to view items. Battle item use is not yet available.');
 if(action==='fight'){
  const d=activeDragon(p);
  if(!d)return reply('No healthy dragon. Use '+prefix+'flee then '+prefix+'rest.');
  ensureMoves(d);
  return reply('⚔️ *'+d.species+' moves*\n'+d.moves.map((m,i)=>(i+1)+'. '+m.name+' (Power '+m.power+')').join('\n')+'\n\nUse '+prefix+'battlefight 2');
 }
 return reply('⚔️ *Battle options*\n'+prefix+'battle fight - show moves\n'+prefix+'battle item - view bag\n'+prefix+'flee - forfeit\n'+prefix+'swap 2 - swap dragons (ends turn)');
}};
