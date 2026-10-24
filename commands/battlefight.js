import {updateDatabase} from '../lib/database.js';
import {useMove} from '../lib/combat.js';
export default {name:'battlefight',requiresStarter:true,description:'Use a move by slot number',async execute({sender,reply,args,prefix}){
 const slot=Number(args[0]);
 if(!Number.isInteger(slot)||slot<1||slot>4)return reply('Use '+prefix+'battlefight 1, 2, 3 or 4.');
 const r=await updateDatabase(db=>useMove(db.players[sender],slot));
 if(r.error)return reply(r.error);
 if(r.won)return reply('🏆 Defeated '+r.species+'! +'+r.xp+' XP and +'+r.coins+' coins.\n'+(r.milestones.length?'Move swap unlocked at level '+r.milestones.join(', ')+'!\n':'')+'Recruit it: '+prefix+'recruit party or '+prefix+'recruit den.');
 if(r.enemy.lost)return reply('💤 Defeat. You still earned '+r.enemy.xp+' XP. Use '+prefix+'rest to recover.');
 return reply('⚔️ '+r.move+' dealt '+r.damage+' damage. Enemy HP: '+r.enemyHp+'.\nEnemy dealt '+r.enemy.damage+' damage.\n'+prefix+'battle fight | '+prefix+'battle item | '+prefix+'swap 2 | '+prefix+'flee');
}};
