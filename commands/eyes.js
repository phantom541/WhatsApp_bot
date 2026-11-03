import { readDatabase } from '../lib/database.js';
import { eyeCollection } from '../lib/sea-eyes.js';

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
      '🌊 *THE SEVEN EYES OF THE SEAS*\\n━━━━━━━━━━━━━━━━\\n' +
      eyes.map((eye, i) => (eye.owned ? '🔹' : '🔒') + ' ' + (i + 1) + '. Eye of ' + eye.name + ' | ' + eye.power +
        (eye.owned ? ' • OWNED' : ' • LOCKED') + '\\n   Colossus: ' + eye.beastName).join('\\n') +
      '\\n━━━━━━━━━━━━━━━━\\n👁️ Eyes: ' + owned + '/7' +
      '\\n🌌 Unique Colossi defeated: ' + defeated + '/7' +
      '\\n\\nDefeat and capture the linked Colossus to earn its Eye. The Creator can also grant an Eye.'
    );
  }
};
