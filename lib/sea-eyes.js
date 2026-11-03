export const SEA_EYES = Object.freeze([
  { id: 'blazz', name: 'Blazz', sea: 'Fire Sea', power: 'Fire', beastId: 'death', beastName: 'Death the Wolf' },
  { id: 'sino', name: 'Sino', sea: 'Ice Sea', power: 'Ice', beastId: 'orchestra', beastName: 'Orchestra of the Doom Echo' },
  { id: 'dezer', name: 'Dezer', sea: 'Sand Sea', power: 'Sand', beastId: 'goldhuneenay', beastName: 'Goldhuneenay the Inexhaustible' },
  { id: 'aeria', name: 'Aeria', sea: 'Storm Sea', power: 'Storm', beastId: 'siegwurm', beastName: 'Siegwurm the Sky Ruler' },
  { id: 'beru', name: 'Beru', sea: 'Water Sea', power: 'Water', beastId: 'ctarnidd', beastName: 'Ctarnidd of the Abyss' },
  { id: 'vapir', name: 'Vapir', sea: 'Shadow Sea', power: 'Shadows', beastId: 'lycagon', beastName: 'Lycagon the Nightslayer' },
  { id: 'zite', name: 'Zite', sea: 'Star Sea', power: 'Stars', beastId: 'wethermon', beastName: 'Wethermon the Tombguard' }
]);

export function normalizeEyes(player) {
  if (!Array.isArray(player.seaEyes)) player.seaEyes = [];
  if (!Array.isArray(player.colossalBeastsDefeated)) player.colossalBeastsDefeated = [];
  player.seaEyes = [...new Set(player.seaEyes.filter(id => SEA_EYES.some(eye => eye.id === id)))];
  player.colossalBeastsDefeated = [...new Set(player.colossalBeastsDefeated.filter(Boolean))];
}

export function recordColossusDefeat(player, beast) {
  normalizeEyes(player);
  const beastKey = beast.colossusId || beast.species || beast.id;
  const eye = SEA_EYES.find(item => item.beastId === beastKey);
  if (!eye) return { newDefeat: false, defeated: player.colossalBeastsDefeated.length, awarded: [], error: 'No Sea Eye is linked to this Colossus.' };
  if (player.colossalBeastsDefeated.includes(beastKey)) {
    return { newDefeat: false, defeated: player.colossalBeastsDefeated.length, awarded: [] };
  }

  player.colossalBeastsDefeated.push(beastKey);
  const awarded = [];
  if (!player.seaEyes.includes(eye.id)) {
    player.seaEyes.push(eye.id);
    awarded.push(eye);
  }
  return { newDefeat: true, defeated: player.colossalBeastsDefeated.length, awarded, beast: eye.beastName, eye };
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
