import {readDatabase} from '../lib/database.js';
import {ALL_GOODS} from '../lib/catalog.js';
import {inventoryCount} from '../lib/items.js';
export default {name:'bag',requiresStarter:true,description:'View purchased items and charms',async execute({sender,reply,prefix}){
 const p=(await readDatabase()).players[sender];
 const entries=Object.entries(ALL_GOODS).map(([key,item])=>({name:item.name,count:inventoryCount(p,key)})).filter(x=>x.count>0);
 return reply('🎒 *Bag*\n'+(entries.length?entries.map(x=>x.name+' ×'+x.count).join('\n'):'Your bag is empty.')+'\n\nBrowse '+prefix+'mart 1 or '+prefix+'shop.');
}};
