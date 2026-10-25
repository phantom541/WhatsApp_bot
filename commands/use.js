import {groupId,world,touchBattle,endBattle} from '../lib/world-events.js';
import {updateDatabase} from '../lib/database.js';
import {useSupply} from '../lib/item-effects.js';
import {enemyTurn} from '../lib/combat.js';
import {activeDragon} from '../lib/collection.js';
export default {name:'use',requiresStarter:true,description:'Use supplies, training goods and tonics',async execute({sender,reply,args,prefix,message}){
 const key=(args[0]||'').toLowerCase().replace(/[-_]/g,''),slot=args[1]===undefined?0:Number(args[1]);
 if(!key||!Number.isInteger(slot)||slot<0)return reply('Usage: '+prefix+'use potion 1');
 const r=await updateDatabase(db=>{
  const p=db.players[sender],group=groupId(message.key.remoteJid),inBattle=Boolean(p.activeEncounter);if(group&&world(db).battles[group]&&world(db).battles[group].player!==sender)return {error:'Another player is battling in this group.'};
  if(inBattle&&slot>0&&p.dragons[slot-1]?.id!==activeDragon(p)?.id)return {error:'During battle, use items on the active dragon only.'};
  const result=useSupply(p,key,slot);
  if(result.error)return result;
  if(inBattle){if(group)touchBattle(db,group,sender);result.turn=enemyTurn(p,p.activeEncounter);if(result.turn.lost&&group)endBattle(db,group);}
  return result;
 });
 if(r.error)return reply(r.error);
 return reply('🎒 Used '+key+' on '+r.dragon+'. HP: '+r.hp+'/'+r.maxHp+'. Effect: '+r.effect+'.'+(r.turn?' Turn ended. '+(r.turn.lost?'Defeat, +'+(r.turn.xp||0)+' XP.':'Enemy dealt '+r.turn.damage+' damage.'):''));
}};
