import { STARTERS, createStarter, describeDragon } from '../lib/dragons.js';
import { updateDatabase } from '../lib/database.js';
export default {
  name: 'starter',
  description: 'Choose a starter dragon: ember, tide, or gale',
  async execute({ sender, reply, prefix, args }) {
    const choice = args[0]?.toLowerCase();
    if (!choice) {
      return reply('🐉 *Choose your starter dragon*\n\n' +
        Object.entries(STARTERS).map(([key, d]) => d.emoji + ' *' + key + '* - ' + d.species + ' (' + d.element + ')\nHP ' + d.baseHp + ' | ATK ' + d.attack + ' | DEF ' + d.defense + ' | SPD ' + d.speed).join('\n\n') +
        '\n\nChoose using *' + prefix + 'starter ember*, *' + prefix + 'starter tide*, or *' + prefix + 'starter gale*.');
    }
    if (!STARTERS[choice]) return reply('Unknown starter. Use ' + prefix + 'starter to see your options.');
    const result = await updateDatabase(db => {
      const player = db.players[sender];
      if (!player) return { error: 'Register first with ' + prefix + 'register.' };
      if (!Array.isArray(player.dragons)) player.dragons = [];
      if (player.starterClaimed || player.dragons.length > 0) return { error: 'You already own a dragon. Free starter selection is only available once.' };
      const dragon = createStarter(choice);
      player.dragons.push(dragon);
      player.starterClaimed = true;
      return { dragon };
    });
    if (result.error) return reply(result.error);
    return reply('🎉 *Starter dragon claimed!*\n\n' + describeDragon(result.dragon));
  }
};
