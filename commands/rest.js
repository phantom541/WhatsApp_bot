import { updateDatabase } from '../lib/database.js';
const REST_COOLDOWN_MS = 5 * 60_000;
export default {
  name: 'rest', requiresStarter: true, description: 'Restore your dragons after a cooldown',
  async execute({ sender, reply }) {
    const result = await updateDatabase(db => {
      const p = db.players[sender];
      if (p.activeEncounter) return { error: 'You cannot rest during a battle. Use _flee first.' };
      const now = Date.now();
      const remaining = REST_COOLDOWN_MS - (now - (p.lastRestAt || 0));
      if (remaining > 0) return { error: '⏳ Rest again in ' + Math.ceil(remaining / 1000) + ' seconds.' };
      for (const d of p.dragons) d.hp = d.maxHp || d.hp;
      p.lastRestAt = now;
      return { healed: p.dragons.length };
    });
    return reply(result.error || '💚 Your ' + result.healed + ' dragon(s) are fully rested!');
  }
};
