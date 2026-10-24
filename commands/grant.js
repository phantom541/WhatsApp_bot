import {updateDatabase} from '../lib/database.js';
import {roleOf,roleRank} from '../lib/roles.js';
import {phoneDigits} from '../lib/identity.js';
import {staffState,logStaff,targetPlayer,safeAmount} from '../lib/admin.js';
export default {name:'grant',description:'Bot staff grant coins to a registered rider',async execute({phone,reply,args,prefix}){
 const target=args[0]==='me'?phone:phoneDigits(args[0]),amount=safeAmount(args[1],1000000);
 if(target.length<8||!amount)return reply('Usage: '+prefix+'grant 267XXXXXXXX 500 (max 1000000)');
 const result=await updateDatabase(db=>{
 staffState(db);if(roleRank(roleOf(db,phone))<1)return 'Bot moderator role required.';
 const found=targetPlayer(db,target);if(!found)return 'Target must be registered with a phone number.';
 found.player.coins=(found.player.coins||0)+amount;
 logStaff(db,phone,'grant',target+' +'+amount);return '🪙 Granted '+amount+' coins. New balance: '+found.player.coins;
 });return reply(result);
}};
