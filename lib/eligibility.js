import { readDatabase } from './database.js';
export function hasStarter(player) {
  return Boolean(player && Array.isArray(player.dragons) && player.dragons.some(d => !d.creatorBound));
}
export function starterRequiredMessage(prefix = '_') {
  return '🐉 You do not have a starter dragon yet! Use *' + prefix + 'starthunt* to begin your dragon selection journey.';
}
export async function requireStarter(sender, reply, prefix = '_') {
  const player = (await readDatabase()).players[sender];
  if (!hasStarter(player)) {
    await reply(starterRequiredMessage(prefix));
    return false;
  }
  return true;
}
