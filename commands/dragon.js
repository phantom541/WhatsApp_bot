import { readDatabase } from '../lib/database.js';
import { describeDragon } from '../lib/dragons.js';
export default {
  name: 'dragon', description: 'Inspect a dragon by number',
  async execute({ sender, reply, prefix, args }) {
    const player = (await readDatabase()).players[sender];
    if (!player) return reply('Register first with ' + prefix + 'register.');
    if (!player.dragons?.length) return reply('You have no dragons. Use ' + prefix + 'starter.');
    const n = Number(args[0] || 1);
    if (!Number.isSafeInteger(n) || n < 1 || n > player.dragons.length) return reply('Choose a valid dragon number. See ' + prefix + 'dragons.');
    return reply(describeDragon(player.dragons[n - 1]));
  }
};
