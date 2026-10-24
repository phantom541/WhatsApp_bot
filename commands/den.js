import {readDatabase} from '../lib/database.js';
import {ensureCollection} from '../lib/collection.js';
export default {name:'den',requiresStarter:true,description:'Show stored dragons',async execute({sender,reply,prefix}){
 const p=(await readDatabase()).players[sender];ensureCollection(p);
 return reply('🏡 *Dragon Den ('+p.den.length+')*\n'+(p.den.map(id=>{const i=p.dragons.findIndex(d=>d.id===id),d=p.dragons[i];return d?(i+1)+'. '+d.species+' Lv '+d.level:'';}).filter(Boolean).join('\n')||'Empty')+'\nTransfer using collection number: '+prefix+'transfer 3 party.');
}};
