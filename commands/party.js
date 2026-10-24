import {readDatabase} from '../lib/database.js';
import {ensureCollection} from '../lib/collection.js';
export default {name:'party',requiresStarter:true,description:'Show up to six party dragons',async execute({sender,reply,prefix}){
 const p=(await readDatabase()).players[sender];ensureCollection(p);
 const lines=p.party.map((id,i)=>{const d=p.dragons.find(x=>x.id===id);return d?(i+1)+'. '+d.species+' Lv '+d.level+' '+d.hp+'/'+d.maxHp+' HP':'Empty';});
 return reply('🐉 *Your party ('+p.party.length+'/6)*\n'+(lines.join('\n')||'Empty')+'\nTransfer with '+prefix+'transfer 1 den.');
}};
