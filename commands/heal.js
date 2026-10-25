import { updateDatabase } from '../lib/database.js';
import { ensureCollection } from '../lib/collection.js';

const COOLDOWN_MS = 300_000;
export default {
  name: 'heal',
  requiresStarter: true,
  description: 'Heal every dragon in your party (300-second cooldown)',
  async execute({ sender, reply }) {
    const result = await updateDatabase(db => {
      const p = db.players?.[sender];
      if (!p) return { error: 'Register first.' };
      if (p.activeEncounter) return { error: '⚔️ You cannot heal during a battle. Flee or finish first.' };
      ensureCollection(p);
      const now = Date.now();
      const remaining = COOLDOWN_MS - (now - (p.lastPartyHealAt || 0));
      if (remaining > 0) return { error: '⏳ Healing available in ' + Math.ceil(remaining / 1000) + ' seconds.' };
      let healed = 0;
      for (const d of p.dragons) {
        if (!p.party.includes(d.id)) continue;
        if (Number.isFinite(d.maxHp) && d.maxHp > 0) {
          d.hp = d.maxHp;
          healed++;
        }
      }
      if (!healed) return { error: 'No party dragons available to heal.' };
      p.lastPartyHealAt = now;
      return { healed };
    });
    return reply(result.error || '💚 *DRAGON SANCTUARY*\n━━━━━━━━━━━━\n🐉 Restored ' + result.healed + ' party dragon(s) to full HP.\n⏳ Next heal: 300 seconds.');
  }
};
