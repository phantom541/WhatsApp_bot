import { randomInt, randomUUID } from 'node:crypto';
import { DRAGON_CLASSES } from './dragons.js';
export const HUNT_COOLDOWN_MS = 60_000;
export function createEncounter() {
  const classes = Object.values(DRAGON_CLASSES);
  const dragonClass = classes[randomInt(classes.length)];
  const species = dragonClass.species[randomInt(dragonClass.species.length)];
  const level = randomInt(1, 5);
  return { id: randomUUID(), species, dragonClass: dragonClass.label, emoji: dragonClass.emoji, level, hp: 24 + level * 9, attack: 4 + level * 2, createdAt: Date.now() };
}
export function resolveBattle(player, encounter) {
  const dragon = player.dragons.find(d => d.hp > 0);
  if (!dragon) return { error: 'Your dragons are exhausted. Healing is not available yet.' };
  const damage = Math.max(1, (dragon.attack || 10) + randomInt(0, 7) - Math.floor(encounter.level * 1.5));
  const enemyRemaining = Math.max(0, encounter.hp - damage);
  if (enemyRemaining === 0) {
    const coins = 10 + encounter.level * 5;
    const xp = 8 + encounter.level * 4;
    player.coins = (player.coins || 0) + coins;
    player.xp = (player.xp || 0) + xp;
    dragon.xp = (dragon.xp || 0) + xp;
    while (dragon.xp >= dragon.level * 30) {
      dragon.xp -= dragon.level * 30;
      dragon.level++;
      dragon.maxHp = (dragon.maxHp || dragon.hp) + 8;
      dragon.hp = Math.min(dragon.maxHp, dragon.hp + 8);
      dragon.attack = (dragon.attack || 10) + 2;
      dragon.defense = (dragon.defense || 0) + 1;
    }
    player.activeEncounter = null;
    return { victory: true, damage, coins, xp, dragon };
  }
  encounter.hp = enemyRemaining;
  const incoming = Math.max(1, encounter.attack + randomInt(0, 5) - Math.floor((dragon.defense || 0) / 3));
  dragon.hp = Math.max(0, dragon.hp - incoming);
  if (dragon.hp === 0) player.activeEncounter = null;
  return { victory: false, damage, incoming, enemyRemaining, dragon, defeated: dragon.hp === 0 };
}
