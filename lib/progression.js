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
    dragon.maxHp = (dragon.maxHp || dragon.hp) + 8;
    dragon.hp = Math.min(dragon.maxHp, dragon.hp + 8);
    dragon.attack += 2;
    dragon.defense += 1;
    if (MOVE_LEVELS.includes(dragon.level)) {
      dragon.moveCredits = (dragon.moveCredits || 0) + 1;
      levels.push(dragon.level);
    }
  }
  if (dragon.level >= MAX_LEVEL) dragon.xp = 0;
  return levels;
}
