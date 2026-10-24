import {roleOf} from '../lib/roles.js';
import {randomInt} from 'node:crypto';
import {updateDatabase} from '../lib/database.js';
import {ensureCollection} from '../lib/collection.js';
import {generateWild,REGIONS} from '../lib/regions.js';
export default {name:'spawn',requiresStarter:true,description:'Generate an extra wild dragon encounter',async execute({sender,reply,prefix,phone}){
 const r=await updateDatabase(db=>{
  const p=db.players[sender];ensureCollection(p);if(p.activeEncounter)return {error:'Finish your current encounter first.'};
  if(p.pendingRecruit)return {error:'Recruit your defeated dragon first.'};
  if(!p.dragons?.some(d=>p.party?.includes(d.id)&&d.hp>0))return {error:'No healthy party dragon.'};
  const role=roleOf(db,phone);
  const cooldown=role==='creator'?60000:role==='owner'?90000:role==='mod'?180000:5*60*1000,wait=cooldown-(Date.now()-(p.lastSpawnAt||0));
  if(wait>0)return {error:'Wait '+Math.ceil(wait/1000)+' seconds before another spawn.'};
  const regions=Object.keys(REGIONS),region=p.region&&REGIONS[p.region]?p.region:regions[randomInt(regions.length)];
  p.activeEncounter=generateWild(region);p.lastSpawnAt=Date.now();
  return {encounter:p.activeEncounter};
 });
 if(r.error)return reply(r.error);
 const e=r.encounter;return reply('🐉 *Wild Spawn*\n'+e.species+' | '+e.rarity+' | Level '+e.level+'\nRegion: '+REGIONS[e.region].name+' | HP: '+e.hp+'\n'+prefix+'catch '+e.species.toLowerCase().replace(/\s+/g,'-')+' or '+prefix+'battle');
}};
