import {DUNGEONS} from '../lib/dungeons.js';
export default {name:'dungeons',requiresStarter:true,description:'Explore six mysterious dungeon gates',async execute({reply,prefix}){
 const lines=Object.entries(DUNGEONS).map(([key,d],i)=>(i+1)+'. *'+d.name+'*\n'+d.description+'\nInspect: '+prefix+'dungeon '+key);
 return reply('🌀 *The Six Dungeon Gates*\n\n'+lines.join('\n\n'));
}};