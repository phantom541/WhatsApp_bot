import {readDatabase} from '../lib/database.js';
export default {name:'bag',requiresStarter:true,description:'View your battle inventory',async execute({sender,reply}){
 const p=(await readDatabase()).players[sender];
 const items=p.inventory||[];
 return reply('🎒 Bag\n'+(items.length?items.map((x,i)=>(i+1)+'. '+(typeof x==='string'?x:x.name||'Item')).join('\n'):'Your bag is empty.')+'\nItem usage is not yet available.');
}};
