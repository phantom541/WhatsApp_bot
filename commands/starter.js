import { DRAGON_CLASSES, createStarter, describeDragon } from '../lib/dragons.js';
import { updateDatabase } from '../lib/database.js';
export default {
  name: 'starter',
  description: 'Choose one of seven dragon classes',
  async execute({ sender, reply, prefix, args }) {
    const choice = args[0]?.toLowerCase();
    if (!choice) return reply('🐉 *Choose your starter class*\n\n' +
      Object.entries(DRAGON_CLASSES).map(([key, d]) => d.emoji + ' *' + d.label + '* - ' + d.starter + '\n' + d.specialty + '\nHP ' + d.hp + ' | ATK ' + d.attack + ' | DEF ' + d.defense + ' | SPD ' + d.speed).join('\n\n') +
      '\n\nChoose with *' + prefix + 'starter strike* (or another class). View species with *' + prefix + 'classes*.');
    if (!DRAGON_CLASSES[choice]) return reply('Unknown class. Use ' + prefix + 'starter to see all seven.');
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
    return reply(result.error || '🎉 *Starter dragon claimed!*\n\n' + describeDragon(result.dragon));
  }
};
