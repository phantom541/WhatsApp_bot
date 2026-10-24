import {MART_PAGES} from '../lib/catalog.js';
export default {name:'mart',requiresStarter:true,description:'Browse seven pages of dragon supplies',async execute({reply,args,prefix}){
 const n=args.length?Number(args[0]):1;
 if(!Number.isInteger(n)||n<1||n>7)return reply('Choose a mart page from 1 to 7. Example: '+prefix+'mart 3');
 const p=MART_PAGES[n-1];
 return reply('🏬 *Dragon Mart | Page '+n+'/7*\n*'+p.title+'*\n\n'+p.items.map((x,i)=>(i+1)+'. *'+x.name+'* ('+x.id+') - '+x.price+' coins\n'+x.description).join('\n\n')+'\n\n'+prefix+'mart '+(n===7?1:n+1)+' | '+prefix+'buy '+p.items[0].id+' 1');
}};
