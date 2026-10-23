import { readDatabase } from '../lib/database.js';
export default { name: 'profile', description: 'View your profile', async execute({ sender, reply, prefix }) {
  const player = (await readDatabase()).players[sender];
  if (!player) return reply(`Register first with ${prefix}register`);
  await reply(`🐉 *Your profile*\nLevel: ${player.level}\nXP: ${player.xp}\nCoins: ${player.coins}\nDragons: ${player.dragons.length}`);
} };
