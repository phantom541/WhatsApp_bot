import {readDatabase} from '../lib/database.js';
import {ensureCollection} from '../lib/collection.js';

const safe = value => String(value ?? '').replace(/[\r\n*_~`]/g, '').slice(0, 80);
const hpState = d => {
  const hp = Number(d.hp ?? 0);
  const max = Math.max(1, Number(d.maxHp ?? hp ?? 1));
  if (hp <= 0) return 'Down';
  if (hp / max <= 0.25) return 'Critical';
  if (hp / max <= 0.5) return 'Wounded';
  return 'Fine';
};

function dragonDetails(d, index, prefix) {
  const maxHp = Math.max(1, Number(d.maxHp ?? d.hp ?? 1));
  return [
    '🐉 *DRAGON PROFILE*',
    '━━━━━━━━━━━━━━━━',
    '*' + safe(d.species) + '*',
    '🔢 Party slot: ' + (index + 1),
    '🏹 Level: ' + (Number(d.level) || 1),
    '⚡ XP: ' + (Number(d.xp) || 0),
    '🔋 HP: ' + (Number(d.hp) || 0) + ' / ' + maxHp,
    '♻️ State: ' + hpState(d),
    d.dragonClass ? '🛡️ Class: ' + safe(d.dragonClass) : '',
    d.attack != null ? '⚔️ Attack: ' + d.attack : '',
    d.defense != null ? '🛡️ Defense: ' + d.defense : '',
    d.speed != null ? '💨 Speed: ' + d.speed : '',
    '━━━━━━━━━━━━━━━━',
    'Use ' + prefix + 'party to return to your party.'
  ].filter(Boolean).join('\n');
}

export default {
  name: 'party',
  requiresStarter: true,
  description: 'Show your six-dragon party or inspect a party slot',
  async execute({sender, reply, prefix, args = []}) {
    const db = await readDatabase();
    const p = db.players?.[sender];
    if (!p) return reply('Register first with ' + prefix + 'register.');
    ensureCollection(p);

    const requested = String(args[0] ?? '').trim();
    if (requested) {
      if (!/^\d+$/.test(requested)) return reply('Usage: ' + prefix + 'party <1-6>');
      const slot = Number(requested);
      if (slot < 1 || slot > 6) return reply('Choose a party slot from 1 to 6.');
      const id = p.party[slot - 1];
      if (!id) return reply('Party slot ' + slot + ' is empty.');
      const d = p.dragons.find(x => x.id === id);
      if (!d) return reply('That dragon could not be found in your collection.');
      return reply(dragonDetails(d, slot - 1, prefix));
    }

    const rows = p.party.slice(0, 6).map((id, i) => {
      const d = p.dragons.find(x => x.id === id);
      if (!d) return '*' + (i + 1) + '.* Empty slot';
      const active = p.activeDragonId === d.id ? ' ⭐ *ACTIVE*' : '';
      const maxHp = Math.max(1, Number(d.maxHp ?? d.hp ?? 1));
      return [
        '*' + (i + 1) + '. ' + safe(d.species) + '*' + active,
        '🏹 Level: ' + (Number(d.level) || 1),
        '⚡ XP: ' + (Number(d.xp) || 0),
        '🔋 HP: ' + (Number(d.hp) || 0) + ' / ' + maxHp,
        '♻️ State: ' + hpState(d)
      ].join('\n');
    });

    while (rows.length < 6) rows.push('*' + (rows.length + 1) + '.* Empty slot');
    const text = [
      '🐉 *DRAGON PARTY*',
      '🏮 *Username:* ' + safe(p.username || p.displayName || sender.split('@')[0]),
      '📦 *Party:* ' + p.party.length + '/6',
      '━━━━━━━━━━━━━━━━',
      ...rows.flatMap((row, i) => [row, ...(i < 5 ? [''] : [])]),
      '━━━━━━━━━━━━━━━━',
      'Use ' + prefix + 'party <1-6> to inspect a dragon.',
      'Move dragons between your party and den with ' + prefix + 'transfer.'
    ].join('\n');
    return reply(text);
  }
};
