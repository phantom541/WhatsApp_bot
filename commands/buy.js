import {updateDatabase} from '../lib/database.js';
import {ITEMS,giveItem} from '../lib/items.js';
export default {name:'buy',requiresStarter:true,description:'Buy items with coins',async execute({sender,reply,args,prefix}){
 const key=(args[0]||'').toLowerCase().replace(/[-_ ]/g,''),quantity=args[1]===undefined?1:Number(args[1]),item=ITEMS[key];
 if(!item||!Number.isSafeInteger(quantity)||quantity<1||quantity>20)return reply('Usage: '+prefix+'buy potion 2 (1 to 20 items). View '+prefix+'shop.');
 const result=await updateDatabase(db=>{const p=db.players[sender],cost=item.price*quantity;if((p.coins||0)<cost)return {error:'Not enough coins. Need '+cost+', have '+(p.coins||0)+'.'};p.coins-=cost;giveItem(p,key,quantity);return {balance:p.coins};});
 return reply(result.error||'🛍️ Bought '+quantity+' × '+item.name+' for '+item.price*quantity+' coins. Balance: '+result.balance+'.');
}};
