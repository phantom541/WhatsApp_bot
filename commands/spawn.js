import staffspawn from './staffspawn.js';
import {roleOf} from '../lib/roles.js';
import {randomInt} from 'node:crypto';
import {updateDatabase} from '../lib/database.js';
import {ensureCollection} from '../lib/collection.js';
import {generateWild,REGIONS} from '../lib/regions.js';
import {groupId,world,createSpawn} from '../lib/world-events.js';
export default {name:'spawn',requiresStarter:true,description:'Spawn a wild dragon',async execute(ctx){
 const {sender,reply,prefix,phone,args,message}=ctx;if(args?.length)return staffspawn.execute(ctx);const group=groupId(message.key.remoteJid);
 const r=await updateDatabase(db=>{const p=db.players[sender];ensureCollection(p);if(group&&(world(db).spawns[group]||world(db).battles[group]))return {error:'This group already has a spawn or battle.'};if(p.activeEncounter||p.pendingRecruit)return {error:'Finish your current encounter.'};if(!p.dragons?.some(d=>p.party?.includes(d.id)&&d.hp>0))return {error:'No healthy dragon.'};const role=roleOf(db,phone),cooldown=role==='creator'?60000:role==='owner'?90000:role==='mod'?180000:300000,wait=cooldown-(Date.now()-(p.lastSpawnAt||0));if(wait>0)return {error:'Wait '+Math.ceil(wait/1000)+' seconds.'};const regions=Object.keys(REGIONS),region=p.region&&REGIONS[p.region]?p.region:regions[randomInt(regions.length)],e=generateWild(region);if(group){if(!createSpawn(db,group,e,sender,true))return {error:'Group is busy.'}}else p.activeEncounter=e;p.lastSpawnAt=Date.now();return {encounter:e}});if(r.error)return reply(r.error);return reply('🐉 *Wild Spawn* '+r.encounter.species+' | Lv '+r.encounter.level+'\n'+(group?'🔒 Spawner-only: 2 minutes. Public afterward. Despawns at 5 minutes if not battling.\n':'')+prefix+'catch '+r.encounter.species+' or '+prefix+'catch');
}};