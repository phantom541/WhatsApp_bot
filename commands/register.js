import { updateDatabase } from '../lib/database.js';
export default { name: 'register', description: 'Create a player profile', async execute({ sender, reply }) {
  const created = await updateDatabase(db => {
    if (db.players[sender]) return false;
    db.players[sender] = { coins: 100, level: 1, xp: 0, dragons: [], inventory: [], createdAt: new Date().toISOString() };
    return true;
  });
  await reply(created ? '🐉 Registered! You received 100 starter coins.' : 'You already have a Dragon Bot profile.');
} };
