import {updateDatabase} from '../lib/database.js';
import {roleOf} from '../lib/roles.js';
import {targetPlayer,logStaff} from '../lib/admin.js';
import {phoneDigits} from '../lib/identity.js';
export default {name:'setdragonlevel',description:'Creator change a dragon level',async execute({phone,reply,args,prefix}){
 const target=phoneDigits(args[0]),index=Number(args[1]),level=Number(args[2]);
 if(target.length<8||!Number.isInteger(index)||index<1||!Number.isInteger(level)||level<1||level>100)return reply('Usage: '+prefix+'setdragonlevel NUMBER 1 50');
 const result=await updateDatabase(db=>{
 if(roleOf(db,phone)!=='creator')return 'Creator access required.';
 const found=targetPlayer(db,target);if(!found)return 'Player not found.';
 const d=found.player.dragons?.[index-1];if(!d)return 'Dragon not found.';
 const difference=level-(d.level||1);
 d.level=level;d.xp=0;d.maxHp=Math.max(1,(d.maxHp||1)+difference*8);d.hp=Math.min(d.maxHp,Math.max(1,(d.hp||1)+difference*8));
 d.attack=Math.max(1,(d.attack||1)+difference*2);d.defense=Math.max(1,(d.defense||1)+difference);d.speed=Math.max(1,(d.speed||1)+Math.floor(difference/3));
 logStaff(db,phone,'setdragonlevel',target+' dragon '+index+' to '+level);
 return 'Dragon '+d.species+' is now level '+level+'.';
 });return reply(result);
}};
