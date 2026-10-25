import {readDatabase} from '../lib/database.js';
import {ensureMoves,availableMoves} from '../lib/moves.js';
import {dragonProfile} from '../lib/dragon-combat-profile.js';
export default {name:'moves',requiresStarter:true,description:'View moves and available replacements',async execute({sender,reply,prefix,args}){
 const p=(await readDatabase()).players[sender];
 const n=Number(args[0]||1);
 const d=p.dragons[n-1];
 if(!d)return reply('Dragon not found. See '+prefix+'dragons.');
 ensureMoves(d);
 const profile=dragonProfile(d.species,d.dragonClass);
 return reply('🐉 *'+d.species+'* Lv.'+d.level+'\nRole: '+profile.label+' | Type: '+profile.type+'\nEquipped:\n'+d.moves.map((m,i)=>(i+1)+'. '+m.name+' (Power '+m.power+', '+m.accuracy+'% accuracy, '+m.type+')').join('\n')+'\n\nSwap credits: '+(d.moveCredits||0)+'\nAvailable: '+availableMoves(d).map(m=>m.name+' (P'+m.power+', '+m.accuracy+'%)').join(', ')+'\n\nUse '+prefix+'replacemove '+n+' 2 <move name shown above>');
}};
