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
    const growth = dragon.starterGrowth === true;
    const hpGain = growth ? (dragon.level >= 50 ? 12 : dragon.level >= 20 ? 10 : 8) : 8;
    dragon.maxHp = (dragon.maxHp || dragon.hp) + hpGain;
    dragon.hp = Math.min(dragon.maxHp, dragon.hp + hpGain);
    dragon.attack += growth && dragon.level % 5 === 0 ? 4 : 2;
    dragon.defense += growth && dragon.level % 4 === 0 ? 2 : 1;
    if (growth && dragon.level % 3 === 0) dragon.speed = (dragon.speed || 0) + 1;
    if (MOVE_LEVELS.includes(dragon.level)) {
      dragon.moveCredits = (dragon.moveCredits || 0) + 1;
      levels.push(dragon.level);
    }
  }
  if (dragon.level >= MAX_LEVEL) dragon.xp = 0;
  return levels;
}
