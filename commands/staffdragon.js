import {updateDatabase} from '../lib/database.js';
import {roleOf,roleRank} from '../lib/roles.js';
import {targetPlayer,logStaff} from '../lib/admin.js';
import {phoneDigits} from '../lib/identity.js';
import {createStarter} from '../lib/dragons.js';
import {addDragon} from '../lib/collection.js';
export default {name:'staffdragon',description:'Bot owner grant a named dragon',async execute({phone,reply,args,prefix}){
 const target=phoneDigits(args[0]);const species=args.slice(1).join(' ');
 if(target.length<8||!species)return reply('Usage: '+prefix+'staffdragon NUMBER night-fury');
 const template=createStarter(species);if(!template)return reply('Unknown species. Check _classes.');
 const result=await updateDatabase(db=>{
  if(roleRank(roleOf(db,phone))<2)return 'Bot owner or creator required.';
  const recipient=targetPlayer(db,target);if(!recipient)return 'Player not found.';
  template.isStarter=false;template.tradable=true;template.rarity='Rare';
  const destination=addDragon(recipient.player,template);
  logStaff(db,phone,'staffdragon',template.species+' to '+target);
  return '🐉 Granted '+template.species+' to '+destination+'.';
 });return reply(result);
}};
