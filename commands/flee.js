import { updateDatabase } from '../lib/database.js';
export default {
  name: 'flee', requiresStarter: true, description: 'Leave a wild encounter',
  async execute({ sender, reply }) {
    const fled = await updateDatabase(db => {
      const p = db.players[sender];
      if (!p.activeEncounter) return false;
      p.activeEncounter = null;
      return true;
    });
    return reply(fled ? '🏃 You escaped the encounter safely.' : 'You are not in an encounter.');
  }
};
