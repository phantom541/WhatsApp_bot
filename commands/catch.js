import {recordQuest} from '../lib/quests.js';
import {captureChance} from '../lib/capture.js';
import {randomInt} from 'node:crypto';
import {updateDatabase} from '../lib/database.js';
import {normalizeDragonName} from '../lib/dragons.js';
import {createCapturedDragon} from '../lib/dragon-factory.js';
import {addDragon,activeDragon} from '../lib/collection.js';
import {winXp,awardXp} from '../lib/progression.js';
import {groupId,world,claimEncounter,beginBattle,endBattle,touchBattle} from '../lib/world-events.js';
export default {name:'catch',requiresStarter:true,description:'Catch or battle a wild dragon',async execute({sender,reply,args,prefix,message}){
 const name=args.join(' ').trim(),group=groupId(message.key.remoteJid);
 const r=await updateDatabase(db=>{const p=db.players[sender];let e=p.activeEncounter;if(group){const claim=claimEncounter(db,group,sender);if(claim.error)return {error:claim.error};e=claim.encounter;if(!p.activeEncounter||p.activeEncounter.id!==e.id)p.activeEncounter={...e};}
 if(!e)return {error:'No wild dragon. Use '+prefix+'hunt.'};
 if(!name){if(group&&!beginBattle(db,group,sender,'wild'))return {error:'Another player is battling.'};if(group)touchBattle(db,group,sender);return {battle:true,species:e.species}}
 if(normalizeDragonName(name.replace(/-/g,' '))!==normalizeDragonName(e.species))return {error:'The wild dragon is '+e.species+'.'};
 if(e.isColossus)return {error:'Colossal Beasts cannot be caught. Use _catch without a name to battle it.'};
 if(group&&world(db).battles[group]&&world(db).battles[group].player!==sender)return {error:'Another player is battling.'};
 const penalty={Common:0,Uncommon:5,Rare:12,Epic:20,Legendary:30}[e.rarity]||0,chance=Math.max(3,captureChance(e)-penalty);e.captureTool=null;
 if(randomInt(100)>=chance)return {failed:true,chance};
 const d=createCapturedDragon(e);if(!d)return {error:'Unknown dragon.'};const location=addDragon(p,d),xp=winXp(e.level);p.xp=(p.xp||0)+xp;const active=activeDragon(p),milestones=active?awardXp(active,xp):[];p.activeEncounter=null;if(group)endBattle(db,group);recordQuest(p,'catch');return {caught:true,species:d.species,location,xp,milestones}});
 if(r.error)return reply(r.error);if(r.battle)return reply('⚔️ Battle with '+r.species+'! Use '+prefix+'battle fight to view moves.');if(r.failed)return reply('🐉 Catch failed! Chance '+r.chance+'%.');return reply('🎉 Caught '+r.species+'! Sent to '+r.location+'. +'+r.xp+' XP.');
}};