import {updateDatabase} from '../lib/database.js';
import {HUNT_COOLDOWN_MS} from '../lib/hunting.js';
import {randomInt} from 'node:crypto';
import {roleOf} from '../lib/roles.js';
import {generateWild,REGIONS} from '../lib/regions.js';
import {recordQuest} from '../lib/quests.js';
import {ensureCollection} from '../lib/collection.js';
import {consumeItem,inventoryCount} from '../lib/items.js';
import {groupId,createSpawn,world} from '../lib/world-events.js';
export default {name:'hunt',requiresStarter:true,description:'Find a wild dragon',async execute({sender,reply,prefix,phone,message}){
 const group=groupId(message.key.remoteJid);const r=await updateDatabase(db=>{const p=db.players[sender];if(p.pendingRecruit)return {error:'Recruit your defeated dragon first.'};if(p.activeEncounter)return {existing:p.activeEncounter};if(group&&(world(db).spawns[group]||world(db).battles[group]))return {error:'A dragon spawn or battle is already active in this group.'};const now=Date.now(),tiers={player:HUNT_COOLDOWN_MS,mod:40000,owner:25000,creator:15000},wait=tiers[roleOf(db,phone)]-(now-(p.lastHuntAt||0));if(wait>0)return {error:'Wait '+Math.ceil(wait/1000)+' seconds.'};ensureCollection(p);if(!p.dragons.some(d=>p.party.includes(d.id)&&d.hp>0))return {error:'No healthy party dragon.'};const region=p.region&&REGIONS[p.region]?p.region:Object.keys(REGIONS)[randomInt(Object.keys(REGIONS).length)];const boost=inventoryCount(p,'rarebait')?15:0;if(boost)consumeItem(p,'rarebait');const e=generateWild(region,boost);if(group){if(!createSpawn(db,group,e,sender))return {error:'This group is busy.'}}else p.activeEncounter=e;p.lastHuntAt=now;recordQuest(p,'hunt');return {encounter:e}});if(r.error)return reply(r.error);const e=r.encounter||r.existing;return reply('🌲 *Wild dragon!* '+e.species+' | Level '+e.level+' | HP '+e.hp+'\n'+(group?'⏳ Five minutes before it disappears unless battling.\n':'')+'Use '+prefix+'catch '+e.species+' or '+prefix+'catch to battle.');
}};