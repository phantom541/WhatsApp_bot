import { STARTER_GUIDE, STARTER_ORDER } from '../lib/starter-guide.js';
import { sendStarterImage } from '../lib/starter-images.js';
import { updateDatabase } from '../lib/database.js';
import { hasStarter } from '../lib/eligibility.js';
import { DRAGON_CLASSES, findStarterSpecies, createStarter, describeDragon } from '../lib/dragons.js';
export default {
  name: 'starthunt', description: 'Explore starter classes or preview a dragon with --name',
  async execute({ sender, reply, prefix, args, sock, message }) {
    const requested = args.join(' ').trim();
    const preview = requested ? findStarterSpecies(requested) : null;
    const starterPreview = preview && STARTER_GUIDE[preview.species] ? preview : null;
    if (requested && !starterPreview) return reply('Unknown dragon. Use *' + prefix + 'starthunt* to see all available species. Example: *' + prefix + 'starthunt --skrill*.');
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
    if (starterPreview) {
      const dragon = createStarter(starterPreview.species);
      const info = STARTER_GUIDE[starterPreview.species];
      const slug = starterPreview.species.toLowerCase().replace(/\s+/g, '-');
      const caption = [
        '🐉 *DRΔGØN FΔLL | STARTER ENCYCLOPEDIA*',
        '━━━━━━━━━━━━━━━━━━━━',
        starterPreview.dragonClass.emoji + ' *' + starterPreview.species.toUpperCase() + '*',
        '*Class:* ' + starterPreview.dragonClass.label,
        '*Specialty:* ' + starterPreview.dragonClass.specialty,
        '',
        '📖 *ABOUT THIS DRAGON*', info.overview,
        '',
        '🌍 *HABITAT*', info.habitat,
        '',
        '🧠 *TEMPERAMENT*', info.temperament,
        '',
        '⚔️ *COMBAT STYLE*', info.style,
        '',
        '💪 *STRENGTHS*', info.strengths,
        '',
        '⚖️ *TRADE-OFF*', info.tradeoff,
        '',
        '✨ *SIGNATURE ABILITY*', info.signature,
        '',
        '📊 *YOUR LEVEL 1 STARTER STATS*',
        describeDragon(dragon),
        '',
        '🎯 *RIDER ADVICE*', info.tip,
        '',
        '🔒 Your gifted starter is non-tradable. Wild dragons of the same species can still be caught and traded.',
        '',
        '✅ *CLAIM THIS DRAGON*',
        '*' + prefix + 'starterdrgon --' + slug + '-choose*',
        '',
        '↩️ Compare all seven: *' + prefix + 'starthunt*'
      ].join('\n');
      return sendStarterImage(sock, message, starterPreview.species, caption, reply);
    }
    const lineup=STARTER_ORDER.map((species,index)=>{
      const found=findStarterSpecies(species);
      const info=STARTER_GUIDE[species];
      const slug=species.toLowerCase().replace(/\s+/g,'-');
      return (index+1)+'. '+found.dragonClass.emoji+' *'+species+'*  |  '+found.dragonClass.label+' Class\n'
        +'   '+info.summary+'\n'
        +'   🔎 *'+prefix+'starthunt --'+slug+'*';
    });
    return reply([
      '🐉 *DRΔGØN FΔLL | THE SEVEN STARTERS*',
      '━━━━━━━━━━━━━━━━━━━━',
      'Every great rider begins with a single dragon. Seven classes. Seven different paths. Choose carefully: your first partner will grow alongside you.',
      '',
      ...lineup.flatMap(line=>[line,'']),
      '━━━━━━━━━━━━━━━━━━━━',
      '📜 *HOW TO CHOOSE*',
      '1️⃣ Preview a dragon using its name, e.g. *'+prefix+'starthunt --skrill*.',
      '2️⃣ Read its full description, stats, strengths, weaknesses and fighting style. The preview includes its official starter image.',
      '3️⃣ Confirm your choice with *'+prefix+'starterdrgon --skrill-choose* (replace skrill with your chosen dragon).',
      '',
      '⚠️ Only one gifted starter per rider. Your starter begins at Level 1 and cannot be traded.',
      '🔥 *The fire is not to be feared. It is to be wielded.*'
    ].join('\n'));

  }
};
