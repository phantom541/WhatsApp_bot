// Rider progression is independent of dragon levels.
export const RIDER_LEVEL_CAP = 12;
export const riderXpNeeded = level => 100 * level * level + 50 * level;
export const riderTitle = level => [
  'Hatchling', 'Trail Scout', 'Wild Tracker', 'Dragon Keeper',
  'Sky Wanderer', 'Storm Rider', 'Rune Seeker', 'Beast Hunter',
  'Dungeon Veteran', 'Legend Chaser', 'Realm Guardian', 'Ascendant'
][Math.max(0, Math.min(RIDER_LEVEL_CAP, level) - 1)];
export function awardRiderXp(player, amount) {
  player.riderLevel = Math.max(1, Math.min(RIDER_LEVEL_CAP, Number(player.riderLevel) || 1));
  player.riderXp = Math.max(0, Number(player.riderXp) || 0);
  if (!Number.isFinite(amount) || amount <= 0) return { levels: [], ascended: false };
  const levels = [];
  if (player.riderLevel >= RIDER_LEVEL_CAP) {
    player.ascensionXp = (player.ascensionXp || 0) + Math.floor(amount);
    return { levels, ascended: false };
  }
  player.riderXp += Math.floor(amount);
  while (player.riderLevel < RIDER_LEVEL_CAP && player.riderXp >= riderXpNeeded(player.riderLevel)) {
    player.riderXp -= riderXpNeeded(player.riderLevel);
    player.riderLevel++;
    levels.push(player.riderLevel);
  }
  const ascended = player.riderLevel === RIDER_LEVEL_CAP && !player.ascensionUnlocked;
  if (ascended) {
    player.ascensionUnlocked = true;
    player.ascensionXp = player.riderXp;
    player.riderXp = 0;
    player.ascensionNotificationPending = true;
  }
  return { levels, ascended };
}
