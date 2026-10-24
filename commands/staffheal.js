import {updateDatabase} from '../lib/database.js';
import {roleOf,roleRank} from '../lib/roles.js';
import {targetPlayer,logStaff} from '../lib/admin.js';
import {phoneDigits} from '../lib/identity.js';
export default {name:'staffheal',description:'Heal a player collection',async execute({phone,reply,args,prefix}){
 const target=phoneDigits(args[0]);if(target.length<8)return reply('Usage: '+prefix+'staffheal NUMBER');
 const result=await updateDatabase(db=>{
 if(roleRank(roleOf(db,phone))<1)return 'Bot staff only.';
 const found=targetPlayer(db,target);if(!found)return 'Player not found.';
 if(found.player.activeEncounter)return 'Player is in battle.';
 for(const dragon of found.player.dragons||[])dragon.hp=dragon.maxHp||dragon.hp;
 logStaff(db,phone,'staffheal',target);return 'Player dragons recovered.';
 });return reply(result);
}};
