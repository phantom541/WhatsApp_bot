import { readDatabase } from '../lib/database.js';
import { eyeCollection, normalizeEyes } from '../lib/sea-eyes.js';

export default {
  name: 'eyes',
  description: 'View the Seven Eyes of the Seven Seas collection',
  async execute({ sender, reply, prefix }) {
    const db = await readDatabase();
    const player = db.players?.[sender];
    if (!player) return reply('Register first with ' + prefix + 'register.');
    const eyes = eyeCollection(player);
    const defeated = player.colossalBeastsDefeated?.length || 0;
    const owned = eyes.filter(eye => eye.owned).length;
    return reply(
      '🌊 *THE SEVEN EYES OF THE SEAS*\n━━━━━━━━━━━━━━━━\n' +
      eyes.map((eye, i) => (eye.owned ? '🔹' : '🔒') + ' ' + (i + 1) + '. ' + eye.name + ' | ' + eye.power + (eye.owned ? ' • OWNED' : ' • UNCLAIMED')).join('\n') +
      '\n━━━━━━━━━━━━━━━━\n👁️ Eyes: ' + owned + '/7' +
      '\n🌌 Unique Colossal Beasts defeated: ' + defeated + '/7' +
      '\n\nMilestones: 2 Beasts = 1 Eye • 4 = 2 Eyes • 6 = 3 Eyes • 7 = all 7 Eyes.'
    );
  }
};
