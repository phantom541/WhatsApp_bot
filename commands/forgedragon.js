import {updateDatabase} from '../lib/database.js';
import {roleOf} from '../lib/roles.js';
import {targetPlayer,logStaff} from '../lib/admin.js';
import {phoneDigits} from '../lib/identity.js';
import {createStarter} from '../lib/dragons.js';
import {addDragon} from '../lib/collection.js';
export default {name:'forgedragon',description:'Creator give custom dragon',async execute({phone,reply,args,prefix}){
 const target=phoneDigits(args[0]),level=Number(args[1]),kind=(args[2]||'').toLowerCase();
 const tiers=['common','uncommon','rare','epic','legendary'];
 const d=createStarter(args.slice(3).join(' '));
 if(target.length<8||!Number.isInteger(level)||level<1||level>100||!tiers.includes(kind)||!d)return reply('Usage: '+prefix+'forgedragon NUMBER 50 legendary night-fury');
 const r=await updateDatabase(db=>{
 if(roleOf(db,phone)!=='creator')return 'Creator only.';
 const entry=targetPlayer(db,target);if(!entry)return 'Player not found.';
 d.isStarter=false;d.tradable=true;d.level=level;d.rarity=kind[0].toUpperCase()+kind.slice(1);
 const tier=tiers.indexOf(kind);
 d.maxHp+=level*8+tier*12;d.hp=d.maxHp;d.attack+=level*2+tier*2;d.defense+=Math.floor(level/2)+tier;
 const location=addDragon(entry.player,d);logStaff(db,phone,'forgedragon',d.species);
 return 'Created '+d.rarity+' '+d.species+' level '+level+' in '+location+'.';
 });return reply(r);
}};
