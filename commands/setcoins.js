import {updateDatabase} from '../lib/database.js';
import {roleOf} from '../lib/roles.js';
import {targetPlayer,logStaff} from '../lib/admin.js';
import {phoneDigits} from '../lib/identity.js';
export default {name:'setcoins',description:'Creator set a rider balance',async execute({phone,reply,args,prefix}){
 const target=phoneDigits(args[0]),value=Number(args[1]);
 if(target.length<8||!Number.isSafeInteger(value)||value<0||value>100000000)return reply('Usage: '+prefix+'setcoins NUMBER 100000');
 const r=await updateDatabase(db=>{
 if(roleOf(db,phone)!=='creator')return 'Creator only.';
 const found=targetPlayer(db,target);if(!found)return 'Player not found.';
 found.player.coins=value;logStaff(db,phone,'setcoins',target);return '🪙 Balance set to '+value+'.';
 });return reply(r);
}};
