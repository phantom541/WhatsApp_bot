import {updateDatabase} from '../lib/database.js';
import {roleOf,roleRank} from '../lib/roles.js';
import {phoneDigits} from '../lib/identity.js';
import {staffState,logStaff} from '../lib/admin.js';
export default {name:'unban',description:'Lift a bot ban',async execute({phone,reply,args,prefix}){
 const target=phoneDigits(args[0]);if(target.length<8)return reply('Usage: '+prefix+'unban 267XXXXXXXX');
 const result=await updateDatabase(db=>{
 staffState(db);if(roleRank(roleOf(db,phone))<1)return 'Bot moderator role required.';
 if(!db.botBans[target])return 'That number is not banned.';
 delete db.botBans[target];logStaff(db,phone,'unban',target);return '✅ Ban lifted.';
 });return reply(result);
}};
