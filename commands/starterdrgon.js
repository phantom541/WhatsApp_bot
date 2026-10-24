import { updateDatabase } from '../lib/database.js';
import { createStarter, findStarterSpecies, describeDragon, normalizeDragonName } from '../lib/dragons.js';
export default {
  name: 'starterdrgon', description: 'Confirm a previewed starter: --dragon-name-choose',
  async execute({ sender, reply, prefix, args }) {
    const raw = args.join(' ').trim();
    if (!raw.startsWith('--') || !/-choose$/i.test(raw)) return reply('Usage: *' + prefix + 'starterdrgon --skrill-choose*. First preview with *' + prefix + 'starthunt --skrill*.');
    const name = raw.slice(2).replace(/-choose$/i, '');
    const found = findStarterSpecies(name);
    if (!found) return reply('Unknown dragon. See *' + prefix + 'starthunt* for available dragons.');
    const result = await updateDatabase(db => {
      const player = db.players[sender];
      if (!player) return { error: 'Register first with *' + prefix + 'register*.' };
      if (!Array.isArray(player.dragons)) player.dragons = [];
      if (player.starterClaimed || player.dragons.length) return { error: 'You have already claimed your starter dragon.' };
      if (!player.starterSelectionActive || !player.pendingStarter) return { error: 'First preview a dragon with *' + prefix + 'starthunt --' + name + '*.' };
      if (normalizeDragonName(player.pendingStarter) !== normalizeDragonName(found.species)) return { error: 'You previewed *' + player.pendingStarter + '*. Preview *' + found.species + '* before choosing it.' };
      const dragon = createStarter(found.species);
      player.dragons.push(dragon);
      player.starterClaimed = true;
      player.starterSelectionActive = false;
      player.pendingStarter = null;
      player.starterDragonId = dragon.id;
      return { dragon };
    });
    return reply(result.error || '🎉 *Starter dragon confirmed!*\n\n' + describeDragon(result.dragon) + '\n\nStarter dragons cannot be traded.');
  }
};
