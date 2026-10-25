import {updateDatabase} from '../lib/database.js';
import {useMove} from '../lib/combat.js';
import {dungeonFight} from '../lib/dungeon-combat.js';
import {groupId,world,touchBattle,endBattle} from '../lib/world-events.js';
export default {name:'battlefight',requiresStarter:true,description:'Use a move by slot number',async execute({sender,reply,args,prefix,message}){
 const slot=Number(args[0]);if(!Number.isInteger(slot)||slot<1||slot>4)return reply('Use '+prefix+'battlefight 1, 2, 3 or 4.');
 const group=groupId(message.key.remoteJid);
 const r=await updateDatabase(db=>{const p=db.players[sender];if(group&&world(db).battles[group]?.player!==sender&&world(db).battles[group])return {error:'Another player is battling in this group.'};if(group&&world(db).battles[group])touchBattle(db,group,sender);if(p.dungeonBattle){const result=dungeonFight(p,slot);if((result.won||result.lost)&&group)endBattle(db,group);return {...result,dungeon:true}}const result=useMove(p,slot);if(group&&world(db).spawns[group]&&p.activeEncounter)world(db).spawns[group].hp=p.activeEncounter.hp;if(group&&(result.won||result.enemy?.lost))endBattle(db,group);return result});
 if(r.error)return reply(r.error);
 if(r.dungeon){if(r.cleared)return reply('🏆 Dungeon cleared! Floor 10 boss defeated. +'+r.xp+' XP and bonus coins!');if(r.won)return reply('⚔️ Monster defeated! +'+r.xp+' XP. Floor '+r.floor+'/10 unlocked. Use '+prefix+'dungeon next.');if(r.lost)return reply('💤 Your party was defeated. The dungeon run ended.');return reply('⚔️ You dealt '+r.damage+' damage. Enemy HP: '+r.enemyHp+'. Counterattack: '+r.counter+'. Your dragon HP: '+r.dragonHp+'.')}
 const first=r.enemyFirst?'Wild dragon attacked first. ':'Your dragon attacked first. ',hit=r.miss?'missed':r.damage+' damage ('+r.effectiveness+')';
 if(r.won&&r.colossusLocation)return reply('🌌 COLOSSUS DEFEATED! '+r.species+' joins your '+r.colossusLocation+'! +'+r.xp+' XP.');
 if(r.won)return reply('🏆 '+first+r.move+' dealt '+hit+'. Defeated '+r.species+'! +'+r.xp+' XP and +'+r.coins+' coins.\n'+(r.milestones.length?'Move swap unlocked at level '+r.milestones.join(', ')+'!\n':'')+'Recruit it: '+prefix+'recruit party or '+prefix+'recruit den.');
 if(r.enemy?.lost)return reply('💤 Defeat. You still earned '+r.enemy.xp+' XP. Use '+prefix+'rest to recover.');
 return reply('⚔️ '+first+r.move+' dealt '+hit+'. Enemy HP: '+r.enemyHp+'.\nWild '+r.enemy.move+' dealt '+r.enemy.damage+' damage.\n'+prefix+'battle fight | '+prefix+'battle item | '+prefix+'swap 2 | '+prefix+'flee');
}};