import {updateDatabase} from '../lib/database.js';
import {addDragon} from '../lib/collection.js';
import {dragonSpeciesInfo,DRAGON_CLASSES} from '../lib/dragons.js';
import {randomUUID} from 'node:crypto';
export default {name:'recruit',requiresStarter:true,description:'Send a defeated wild dragon to party or den',async execute({sender,reply,args}){
 const choice=(args[0]||'auto').toLowerCase();
 if(!['auto','party','den'].includes(choice))return reply('Use _recruit party or _recruit den.');
 const r=await updateDatabase(db=>{
  const p=db.players[sender],e=p.pendingRecruit;
  if(!e)return {error:'No defeated dragon awaiting recruitment.'};
  const info=dragonSpeciesInfo(e.species);
  if(!info)return {error:'Unknown dragon species.'};
  const cls=DRAGON_CLASSES[info.dragonClass];
  const level=Math.max(1,Math.min(100,Math.floor(Number(e.level)||1)));
  const hp=Math.max(30,Math.floor(Number(e.maxHp)||24+level*9));
  const d={id:randomUUID(),species:info.species,dragonClass:cls.label,element:cls.label,emoji:cls.emoji,level,xp:0,hp,maxHp:hp,attack:Math.max(1,Number(e.attack)||cls.attack+level*2),defense:cls.defense+Math.floor(level/3),speed:cls.speed+Math.floor(level/4),ability:cls.ability,rarity:info.rarity,powerTier:info.powerTier,origin:info.origin,isStarter:false,tradable:true,acquiredAt:new Date().toISOString()};
  const location=addDragon(p,d,choice);
  p.pendingRecruit=null;
  return {species:d.species,location};
 });
 return reply(r.error||'🐉 '+r.species+' joined your '+r.location+'!');
}};
