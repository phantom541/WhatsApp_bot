import {readDatabase} from '../lib/database.js';
export default {name:'quests',requiresStarter:true,description:'See daily rider challenges',async execute({sender,reply,prefix}){
 const p=(await readDatabase()).players[sender],date=new Date().toISOString().slice(0,10);
 const q=p.quests?.date===date?p.quests:{hunt:0,catch:0,win:0,claimed:[]};
 const tasks=[['hunt',3,70],['catch',1,90],['win',2,110]];
 return reply('📜 *Daily Quests*\n'+tasks.map(([id,target,reward])=>id+': '+Math.min(target,q[id]||0)+'/'+target+' | '+reward+' coins '+(q.claimed?.includes(id)?'✓':'')).join('\n')+'\nClaim with '+prefix+'claimquest hunt');
}};
