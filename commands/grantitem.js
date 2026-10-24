import {updateDatabase} from '../lib/database.js';
import {roleOf,roleRank} from '../lib/roles.js';
import {targetPlayer,safeAmount,logStaff} from '../lib/admin.js';
import {phoneDigits} from '../lib/identity.js';
import {ALL_GOODS} from '../lib/catalog.js';
import {giveItem} from '../lib/items.js';
export default {name:'grantitem',description:'Bot staff grant Mart and Shop items',async execute({phone,reply,args,prefix}){
 const target=phoneDigits(args[0]),item=(args[1]||'').toLowerCase(),count=safeAmount(args[2],20);
 if(target.length<8||!ALL_GOODS[item]||!count)return reply('Usage: '+prefix+'grantitem NUMBER potion 2 (max 20)');
 const r=await updateDatabase(db=>{
 if(roleRank(roleOf(db,phone))<1)return 'Bot staff only.';
 const found=targetPlayer(db,target);if(!found)return 'Target not found. Register first.';
 giveItem(found.player,item,count);logStaff(db,phone,'grantitem',item+' x'+count+' to '+target);
 return '🎁 Granted '+count+' '+ALL_GOODS[item].name+'.';
 });return reply(r);
}};
