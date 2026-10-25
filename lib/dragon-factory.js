import {randomUUID} from 'node:crypto';
import {dragonSpeciesInfo,DRAGON_CLASSES} from './dragons.js';
import {dragonProfile,combatStats} from './dragon-combat-profile.js';
export function createCapturedDragon(encounter){
 const info=dragonSpeciesInfo(encounter?.species);
 if(!info)return null;
 const cls=DRAGON_CLASSES[info.dragonClass];
 const level=Math.max(1,Math.min(100,Math.floor(Number(encounter.level)||1)));
 const red=info.species==='Red Fury';
 const profile=dragonProfile(info.species,info.dragonClass);
 const stats=combatStats(info.species,info.dragonClass,level,info.powerTier);
 const maxHp=Math.max(1,Math.floor(Number(encounter.maxHp)||stats.maxHp));
 return {id:randomUUID(),species:info.species,dragonClass:cls.label,element:cls.label,emoji:red?'🔴':cls.emoji,
 level,xp:0,hp:maxHp,maxHp,attack:Math.max(1,Math.floor(Number(encounter.attack)||stats.attack)),
 defense:Math.max(1,Math.floor(Number(encounter.defense)||stats.defense)),
 speed:Math.max(1,Math.floor(Number(encounter.speed)||stats.speed)),
 role:profile.role,combatType:profile.type,ability:red?'Crimson Stormfire':cls.ability,
 rarity:info.rarity,powerTier:info.powerTier,origin:info.origin,isStarter:false,tradable:true,
 acquiredAt:new Date().toISOString()};
}
