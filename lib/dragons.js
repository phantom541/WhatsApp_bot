import { randomUUID } from 'node:crypto';
export const STARTERS = Object.freeze({
  ember: { species: 'Emberwing', element: 'Fire', emoji: '🔥', baseHp: 120, attack: 18, defense: 9, speed: 11, ability: 'Flame Burst' },
  tide: { species: 'Tidecrest', element: 'Water', emoji: '🌊', baseHp: 135, attack: 13, defense: 14, speed: 9, ability: 'Tidal Shield' },
  gale: { species: 'Galefang', element: 'Wind', emoji: '🌪️', baseHp: 105, attack: 16, defense: 10, speed: 17, ability: 'Wind Slash' },
});
export function createStarter(key) {
  const d = STARTERS[key];
  if (!d) return null;
  return { id: randomUUID(), species: d.species, element: d.element, emoji: d.emoji, level: 1, xp: 0, hp: d.baseHp, maxHp: d.baseHp, attack: d.attack, defense: d.defense, speed: d.speed, ability: d.ability, acquiredAt: new Date().toISOString() };
}
export function describeDragon(d) {
  return [ (d.emoji || '🐉') + ' *' + d.species + '*', 'Element: ' + d.element, 'Level: ' + d.level + ' | XP: ' + d.xp, 'HP: ' + d.hp + '/' + (d.maxHp ?? d.hp), 'ATK: ' + d.attack + ' | DEF: ' + d.defense + ' | SPD: ' + (d.speed ?? 0), 'Ability: ' + d.ability ].join('\n');
}
