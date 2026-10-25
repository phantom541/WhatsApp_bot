import {dragonProfile} from './dragon-combat-profile.js';
export const MAX_LEVEL = 100;
export const MOVE_LEVELS = [10,20,30,40,50,60,70,80,90,100];
export const winXp = level => Math.max(20, Math.floor(level) * 8);
export const lossXp = level => Math.max(5, Math.floor(winXp(level) / 4));
export function awardXp(dragon, amount) {
  dragon.xp = (dragon.xp || 0) + amount;
  const levels = [];
  while (dragon.level < MAX_LEVEL && dragon.xp >= dragon.level * 30) {
    dragon.xp -= dragon.level * 30;
    dragon.level++;
    const role=dragonProfile(dragon.species,dragon.dragonClass).modifiers;
    const starter=dragon.starterGrowth===true;
    const hpBase=starter?(dragon.level>=50?12:dragon.level>=20?10:8):8;
    const hpGain=Math.max(2,Math.round(hpBase*role.hp));
    dragon.maxHp=(dragon.maxHp||dragon.hp)+hpGain;
    dragon.hp=Math.min(dragon.maxHp,dragon.hp+hpGain);
    // Cumulative rounded growth preserves fractions for very slow or defensive species.
    const growthAt=(factor,lv)=>Math.round((lv-1)*factor);
    dragon.attack=(dragon.attack||1)+Math.max(0,growthAt((starter?2.5:2)*role.atk,dragon.level+1)-growthAt((starter?2.5:2)*role.atk,dragon.level));
    dragon.defense=(dragon.defense||1)+Math.max(0,growthAt((starter?1.35:1.15)*role.def,dragon.level+1)-growthAt((starter?1.35:1.15)*role.def,dragon.level));
    dragon.speed=(dragon.speed||1)+Math.max(0,growthAt(0.62*role.spd,dragon.level+1)-growthAt(0.62*role.spd,dragon.level));
    if (MOVE_LEVELS.includes(dragon.level)) {
      dragon.moveCredits = (dragon.moveCredits || 0) + 1;
      levels.push(dragon.level);
    }
  }
  if (dragon.level >= MAX_LEVEL) dragon.xp = 0;
  return levels;
}
