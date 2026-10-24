import {readDatabase} from '../lib/database.js';
import {ensureMoves,availableMoves} from '../lib/moves.js';
export default {name:'moves',requiresStarter:true,description:'View moves and available replacements',async execute({sender,reply,prefix,args}){
 const p=(await readDatabase()).players[sender];
 const n=Number(args[0]||1);
 const d=p.dragons[n-1];
 if(!d)return reply('Dragon not found. See '+prefix+'dragons.');
 ensureMoves(d);
 return reply('🐉 *'+d.species+'* Lv.'+d.level+'\nEquipped:\n'+d.moves.map((m,i)=>(i+1)+'. '+m.name+' ('+m.power+')').join('\n')+'\n\nSwap credits: '+(d.moveCredits||0)+'\nAvailable: '+availableMoves(d).map(m=>m.name).join(', ')+'\n\nUse '+prefix+'replacemove '+n+' 2 Dragon Breath');
}};
