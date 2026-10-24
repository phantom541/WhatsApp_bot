import { updateDatabase } from '../lib/database.js';
import { hasStarter } from '../lib/eligibility.js';
import { DRAGON_CLASSES, findStarterSpecies, createStarter, describeDragon } from '../lib/dragons.js';
export default {
  name: 'starthunt', description: 'Explore starter classes or preview a dragon with --name',
  async execute({ sender, reply, prefix, args }) {
    const requested = args.join(' ').trim();
    const preview = requested ? findStarterSpecies(requested) : null;
    if (requested && !preview) return reply('Unknown dragon. Use *' + prefix + 'starthunt* to see all available species. Example: *' + prefix + 'starthunt --skrill*.');
    const result = await updateDatabase(db => {
      const player = db.players[sender];
      if (!player) return 'register';
      if (hasStarter(player) || player.starterClaimed) return 'owned';
      player.starterSelectionActive = true;
      player.pendingStarter = preview?.species || null;
      return 'ready';
    });
    if (result === 'register') return reply('Register first with *' + prefix + 'register*, then use *' + prefix + 'starthunt*.');
    if (result === 'owned') return reply('🐉 You already have a starter dragon. Use *' + prefix + 'dragons* to view it.');
    if (preview) {
      const dragon = createStarter(preview.species);
      return reply('🔎 *Starter dragon preview*\n\n' + describeDragon(dragon) + '\n\nSpecialty: ' + preview.dragonClass.specialty + '\n\nTo claim this dragon, type *' + prefix + 'starterdrgon --' + preview.species.toLowerCase().replace(/\s+/g, '-') + '-choose*.\nYou can preview another dragon before confirming.');
    }
    return reply('🐉 *Choose your starter dragon*\n\n' +
      Object.entries(DRAGON_CLASSES).map(([key, d]) => d.emoji + ' *' + d.label + ' Class*\n' + d.species.join(', ')).join('\n\n') +
      '\n\nPreview a dragon with *' + prefix + 'starthunt --skrill*.\nAfter previewing, confirm with *' + prefix + 'starterdrgon --skrill-choose*.');
  }
};
