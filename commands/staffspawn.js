import {updateDatabase} from '../lib/database.js';
import {roleOf,roleRank} from '../lib/roles.js';
import {findStarterSpecies} from '../lib/dragons.js';
import {REGIONS} from '../lib/regions.js';
import {randomUUID} from 'node:crypto';
import {logStaff,staffState} from '../lib/admin.js';
import {groupId,world,createSpawn} from '../lib/world-events.js';
export default {name:'staffspawn',description:'Create a named wild encounter',async execute({sender,phone,reply,args,prefix,message}){
 const found=findStarterSpecies(args.join(' '));
 if(!found)return reply('Usage: '+prefix+'staffspawn night-fury');
 const group=groupId(message?.key?.remoteJid);
 const r=await updateDatabase(db=>{
  staffState(db);
  if(roleRank(roleOf(db,phone))<1)return {error:'Bot staff only.'};
  const p=db.players[sender];if(!p)return {error:'Register first.'};
  if(group&&(world(db).spawns[group]||world(db).battles[group]))return {error:'Another spawn or battle is already active in this group.'};
  if(p.activeEncounter||p.pendingRecruit)return {error:'Finish the current encounter.'};
  const level=Math.max(1,Math.min(30,p.dragons?.[0]?.level||1)),hp=24+level*9;
  p.activeEncounter={id:randomUUID(),species:found.species,dragonClass:found.dragonClass.label,emoji:found.dragonClass.emoji,level,hp,maxHp:hp,attack:4+level*2,rarity:'Rare',region:p.region&&REGIONS[p.region]?p.region:'berk',createdAt:Date.now()};
  if(group){if(!createSpawn(db,group,p.activeEncounter,sender,true))return {error:'Group busy.'};p.activeEncounter=null;}
  logStaff(db,phone,'staffspawn',found.species);
  return {species:found.species,level};
 });
 return reply(r.error||'Wild dragon: '+r.species+' (Lv '+r.level+'). Use '+prefix+'catch or '+prefix+'battle.');
}};
