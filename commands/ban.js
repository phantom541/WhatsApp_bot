import {updateDatabase} from '../lib/database.js';
import {roleOf,roleRank} from '../lib/roles.js';
import {phoneDigits} from '../lib/identity.js';
import {staffState,logStaff,protectedTarget,targetPlayer} from '../lib/admin.js';
export default {name:'ban',description:'Bot staff ban a player',async execute({phone,reply,args,prefix}){
 const target=phoneDigits(args[0]);const reason=args.slice(1).join(' ').trim().slice(0,120)||'Bot rule violation';
 if(target.length<8||target.length>15)return reply('Usage: '+prefix+'ban 267XXXXXXXX reason');
 const result=await updateDatabase(db=>{
 staffState(db);if(roleRank(roleOf(db,phone))<1)return 'Bot moderator role required.';
 if(!protectedTarget(db,phone,target))return 'Cannot ban your own or higher-ranked staff role.';
 if(db.botBans[target])return 'Already banned.';
 const record=targetPlayer(db,target);if(!record)return 'Target must have a registered profile with a verified phone number.';
 db.botBans[target]={reason,by:phone,at:new Date().toISOString(),jid:record.jid};
 logStaff(db,phone,'ban',target);
 return '⛔ Player banned from Dragon Bot. Reason: '+reason;
 });return reply(result);
}};
