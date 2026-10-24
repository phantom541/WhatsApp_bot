import { updateDatabase } from '../lib/database.js';
import { resolveBattle } from '../lib/hunting.js';
export default {
  name: 'battle', requiresStarter: true, description: 'Fight your current wild encounter',
  async execute({ sender, reply, prefix }) {
    const result = await updateDatabase(db => {
      const p = db.players[sender];
      if (!p.activeEncounter) return { error: 'No active encounter. Use ' + prefix + 'hunt first.' };
      const species = p.activeEncounter.species;
      return { species, ...resolveBattle(p, p.activeEncounter) };
    });
    if (result.error) return reply(result.error);
    if (result.victory) return reply('🏆 *Victory against ' + result.species + '!*\nDamage: ' + result.damage + '\n+' + result.coins + ' coins | +' + result.xp + ' XP\nYour dragon is now level ' + result.dragon.level + '.');
    if (result.defeated) return reply('💤 Your dragon was exhausted fighting ' + result.species + '. Encounter ended. Healing is coming in a later update.');
    return reply('⚔️ You dealt ' + result.damage + ' damage to ' + result.species + '.\nThe wild dragon dealt ' + result.incoming + ' damage back.\nEnemy HP: ' + result.enemyRemaining + '\nYour dragon HP: ' + result.dragon.hp + '\n\nUse *' + prefix + 'battle* again or *' + prefix + 'flee*.');
  }
};
