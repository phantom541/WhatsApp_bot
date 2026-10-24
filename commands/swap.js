import {updateDatabase} from '../lib/database.js';
import {activeDragon} from '../lib/collection.js';
import {enemyTurn} from '../lib/combat.js';
export default {name:'swap',requiresStarter:true,description:'Swap party dragon and end turn',async execute({sender,reply,args,prefix}){
 const n=Number(args[0]);
 if(!Number.isInteger(n)||n<1)return reply('Use '+prefix+'swap 2 to switch to your second party dragon.');
 const r=await updateDatabase(db=>{
  const p=db.players[sender];
  if(!p.activeEncounter)return {error:'No active battle.'};
  const id=p.party?.[n-1],d=p.dragons.find(x=>x.id===id);
  if(!d||d.hp<=0)return {error:'That party slot has no healthy dragon.'};
  if(activeDragon(p)?.id===id)return {error:'That dragon is already active.'};
  p.activeDragonId=id;
  return {species:d.species,enemy:enemyTurn(p,p.activeEncounter)};
 });
 if(r.error)return reply(r.error);
 return reply('🔄 Swapped to '+r.species+'. Your turn ended. '+(r.enemy.lost?'Your team lost. +'+r.enemy.xp+' XP.':'Enemy dealt '+r.enemy.damage+' damage.'));
}};
