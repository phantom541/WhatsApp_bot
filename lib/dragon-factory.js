import {randomUUID} from 'node:crypto';
import {dragonSpeciesInfo,DRAGON_CLASSES} from './dragons.js';
export function createCapturedDragon(encounter){
 const info=dragonSpeciesInfo(encounter?.species);
 if(!info)return null;
 const cls=DRAGON_CLASSES[info.dragonClass];
 const level=Math.max(1,Math.min(100,Math.floor(Number(encounter.level)||1)));
 const maxHp=Math.max(30,Math.floor(Number(encounter.maxHp)||24+level*9));
 const red=info.species==='Red Fury';
 return {id:randomUUID(),species:info.species,dragonClass:cls.label,element:cls.label,emoji:red?'🔴':cls.emoji,
 level,xp:0,hp:maxHp,maxHp,attack:Math.max(1,Number(encounter.attack)||cls.attack+level*2),
 defense:red?32+Math.floor(level/3):cls.defense+Math.floor(level/3),
 speed:red?38+Math.floor(level/4):cls.speed+Math.floor(level/4),
 ability:red?'Crimson Stormfire':cls.ability,rarity:info.rarity,powerTier:info.powerTier,origin:info.origin,
 isStarter:false,tradable:true,acquiredAt:new Date().toISOString()};
}
