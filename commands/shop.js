import {CHARMS} from '../lib/catalog.js';
export default {name:'shop',requiresStarter:true,description:'View four performance charms',async execute({reply,prefix}){
 return reply('✨ *Dragon Charm Shop | Page 1/1*\n\n'+Object.values(CHARMS).map((x,i)=>(i+1)+'. *'+x.name+'* ('+x.id+') - '+x.price+' coins\n'+x.description).join('\n\n')+'\n\nBuy: '+prefix+'buy powercharm 1\nEquip: '+prefix+'equipcharm 1 powercharm');
}};
