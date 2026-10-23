export const starters = Object.freeze({
  ember: { species: 'Emberwing', element: 'Fire', ability: 'Flame Burst', hp: 110, attack: 16, defense: 8 },
  tide: { species: 'Tidefin', element: 'Water', ability: 'Tidal Shield', hp: 125, attack: 11, defense: 13 },
  grove: { species: 'Groveclaw', element: 'Nature', ability: 'Vine Strike', hp: 120, attack: 13, defense: 11 },
});
export function createStarter(key) {
  const template = starters[key];
  if (!template) return null;
  return { id: 'starter-' + key, species: template.species, element: template.element, ability: template.ability, level: 1, xp: 0, hp: template.hp, attack: template.attack, defense: template.defense, rarity: 'Common', obtainedAt: new Date().toISOString() };
}
