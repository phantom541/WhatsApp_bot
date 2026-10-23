import { updateDatabase } from '../lib/database.js';
import { hasStarter } from '../lib/eligibility.js';
import { DRAGON_CLASSES } from '../lib/dragons.js';
export default {
  name: 'starthunt', description: 'Begin your starter dragon selection journey',
  async execute({ sender, reply, prefix }) {
    const result = await updateDatabase(db => {
      const player = db.players[sender];
      if (!player) return 'register';
      if (hasStarter(player) || player.starterClaimed) return 'owned';
      player.starterSelectionActive = true;
      return 'started';
    });
    if (result === 'register') return reply('Register first with *' + prefix + 'register*, then use *' + prefix + 'starthunt*.');
    if (result === 'owned') return reply('🐉 You already have a starter dragon. Use *' + prefix + 'dragons* to view it.');
    return reply('🐉 *Your Dragon Journey Begins!*\n\nSelect one of the seven classes:\n\n' +
      Object.entries(DRAGON_CLASSES).map(([key, d]) => d.emoji + ' *' + d.label + '* - ' + d.starter + '\n' + d.specialty).join('\n\n') +
      '\n\nClaim your first dragon with *' + prefix + 'starter strike* (replace strike with your chosen class).\nExplore species with *' + prefix + 'classes*.');
  }
};
