export const SEA_EYES = Object.freeze([
  { id: 'blazz', name: 'Blazz', sea: 'Fire Sea', power: 'Fire' },
  { id: 'sino', name: 'Sino', sea: 'Ice Sea', power: 'Ice' },
  { id: 'dezer', name: 'Dezer', sea: 'Sand Sea', power: 'Sand' },
  { id: 'aeria', name: 'Aeria', sea: 'Storm Sea', power: 'Storm' },
  { id: 'beru', name: 'Beru', sea: 'Water Sea', power: 'Water' },
  { id: 'vapir', name: 'Vapir', sea: 'Shadow Sea', power: 'Shadows' },
  { id: 'zite', name: 'Zite', sea: 'Star Sea', power: 'Stars' }
]);

const milestones = new Map([[2, 1], [4, 2], [6, 3], [7, 7]]);

export function normalizeEyes(player) {
  if (!Array.isArray(player.seaEyes)) player.seaEyes = [];
  if (!Array.isArray(player.beastEarnedEyes)) player.beastEarnedEyes = [];
  if (!Array.isArray(player.colossalBeastsDefeated)) player.colossalBeastsDefeated = [];
  player.seaEyes = [...new Set(player.seaEyes.filter(id => SEA_EYES.some(eye => eye.id === id)))];
  player.beastEarnedEyes = [...new Set(player.beastEarnedEyes.filter(id => SEA_EYES.some(eye => eye.id === id)))];
  player.colossalBeastsDefeated = [...new Set(player.colossalBeastsDefeated.filter(Boolean))];
}

export function recordColossusDefeat(player, beast) {
  normalizeEyes(player);
  const beastKey = beast.colossusId || beast.species || beast.id;
  if (player.colossalBeastsDefeated.includes(beastKey)) {
    return { newDefeat: false, defeated: player.colossalBeastsDefeated.length, awarded: [] };
  }
  player.colossalBeastsDefeated.push(beastKey);
  const count = player.colossalBeastsDefeated.length;
  const targetTotal = milestones.get(count) || 0;
  const awarded = [];
  while (player.beastEarnedEyes.length < targetTotal) {
    const eye = SEA_EYES.find(item => !player.beastEarnedEyes.includes(item.id));
    if (!eye) break;
    player.beastEarnedEyes.push(eye.id);
    if (!player.seaEyes.includes(eye.id)) {
      player.seaEyes.push(eye.id);
      awarded.push(eye);
    }
  }
  return { newDefeat: true, defeated: count, awarded };
}

export function grantSeaEye(player, eyeId) {
  normalizeEyes(player);
  const eye = SEA_EYES.find(item => item.id === String(eyeId || '').toLowerCase());
  if (!eye) return { error: 'Unknown Eye. Choose: ' + SEA_EYES.map(item => item.id).join(', ') + '.' };
  if (player.seaEyes.includes(eye.id)) return { error: 'This player already owns the Eye of ' + eye.name + '.' };
  player.seaEyes.push(eye.id);
  return { eye };
}

export function eyeCollection(player) {
  normalizeEyes(player);
  return SEA_EYES.map(eye => ({ ...eye, owned: player.seaEyes.includes(eye.id) }));
}
