import {updateDatabase} from '../lib/database.js';
import {REGIONS} from '../lib/regions.js';
import {isRegionSelector} from '../lib/permissions.js';
export default {name:'travel',requiresStarter:true,description:'Moderator/owner optional region selection',async execute({sender,reply,args,prefix,sock,message}){
 const key=(args[0]||'').toLowerCase();
 if(key!=='random'&&!REGIONS[key])return reply('Use '+prefix+'travel random or a region key shown in '+prefix+'regions.');
 if(!await isRegionSelector(sock,message,sender))return reply('🔒 Region selection is restricted to group moderators and bot owners. Your hunts choose random regions automatically.');
 const result=await updateDatabase(db=>{
  const p=db.players[sender];if(p.activeEncounter||p.pendingRecruit)return 'Finish the current encounter first.';
  p.region=key==='random'?null:key;
  return key==='random'?'🎲 Your hunts now choose random regions.':'🗺️ Region override: '+REGIONS[key].name+'. Hunt with '+prefix+'hunt. Reset with '+prefix+'travel random.';
 });
 return reply(result);
}};
