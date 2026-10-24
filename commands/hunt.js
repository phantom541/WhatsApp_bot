import { updateDatabase } from '../lib/database.js';
import { createEncounter, HUNT_COOLDOWN_MS } from '../lib/hunting.js';
export default {
  name: 'hunt', requiresStarter: true, description: 'Find a wild dragon encounter',
  async execute({ sender, reply, prefix }) {
    const result = await updateDatabase(db => {
      const p = db.players[sender];
      if (p.pendingRecruit) return { error: 'First recruit your defeated dragon with _recruit party or _recruit den.' };
      if (p.activeEncounter) return { existing: p.activeEncounter };
      const now = Date.now();
      const wait = HUNT_COOLDOWN_MS - (now - (p.lastHuntAt || 0));
      if (wait > 0) return { wait: Math.ceil(wait / 1000) };
      if (!p.dragons.some(d => d.hp > 0)) return { error: 'Your dragons are exhausted. Use _rest or a revive to recover.' };
      p.activeEncounter = createEncounter();
      p.lastHuntAt = now;
      return { encounter: p.activeEncounter };
    });
    if (result.error) return reply(result.error);
    if (result.wait) return reply('⏳ Wait ' + result.wait + ' seconds before hunting again.');
    const e = result.encounter || result.existing;
    return reply('🌲 *Wild dragon encountered!*\n' + e.emoji + ' ' + e.species + ' | ' + e.dragonClass + ' Class\nLevel: ' + e.level + ' | HP: ' + e.hp + '\n\nUse *' + prefix + 'catch ' + e.species.toLowerCase().replace(/\s+/g, '-') + '* to catch, *' + prefix + 'catch* to battle, use *' + prefix + 'prepare strongnet* for capture supplies, or *' + prefix + 'flee* to leave.');
  }
};
