import {ITEMS} from '../lib/items.js';
export default {name:'shop',requiresStarter:true,description:'View healing and defense items',async execute({reply,prefix}){
 return reply('🏪 *Dragon Supply Shop*\n'+Object.entries(ITEMS).map(([id,item])=>'*'+item.name+'* ('+id+') - '+item.price+' coins\n'+item.description).join('\n\n')+'\n\nBuy with '+prefix+'buy potion 2');
}};
