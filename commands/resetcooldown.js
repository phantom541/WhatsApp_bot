import {updateDatabase} from '../lib/database.js';
import {roleOf,roleRank} from '../lib/roles.js';
import {targetPlayer,logStaff} from '../lib/admin.js';
import {phoneDigits} from '../lib/identity.js';
export default {name:'resetcooldown',description:'Reset hunting rest and spawn cooldowns',async execute({phone,reply,args,prefix}){
 const target=phoneDigits(args[0]);if(target.length<8)return reply('Usage: '+prefix+'resetcooldown NUMBER');
 const r=await updateDatabase(db=>{
 if(roleRank(roleOf(db,phone))<2)return 'Bot owner or creator required.';
 const found=targetPlayer(db,target);if(!found)return 'Player not found.';
 found.player.lastHuntAt=0;found.player.lastRestAt=0;found.player.lastSpawnAt=0;
 logStaff(db,phone,'resetcooldown',target);return '⏳ Rider cooldowns cleared.';
 });return reply(r);
}};
