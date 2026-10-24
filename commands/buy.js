import {updateDatabase} from '../lib/database.js';
import {ALL_GOODS} from '../lib/catalog.js';
import {giveItem} from '../lib/items.js';
export default {name:'buy',requiresStarter:true,description:'Purchase mart items or charms',async execute({sender,reply,args,prefix}){
 const key=(args[0]||'').toLowerCase().replace(/[-_ ]/g,''),qty=args[1]===undefined?1:Number(args[1]),item=ALL_GOODS[key];
 if(!item||!Number.isSafeInteger(qty)||qty<1||qty>20)return reply('Usage: '+prefix+'buy potion 2. Browse '+prefix+'mart or '+prefix+'shop.');
 const r=await updateDatabase(db=>{
 const p=db.players[sender],cost=item.price*qty;
 if((p.coins||0)<cost)return {error:'Not enough coins. Need '+cost+', have '+(p.coins||0)+'.'};
 p.coins-=cost;giveItem(p,key,qty);return {balance:p.coins};
 });
 return reply(r.error||'🛍️ Purchased '+qty+' × '+item.name+' for '+item.price*qty+' coins. Balance: '+r.balance);
}};
