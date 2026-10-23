import { readDatabase } from '../lib/database.js';
export default {
  name: 'dragons', description: 'List your dragons',
  async execute({ sender, reply, prefix }) {
    const player = (await readDatabase()).players[sender];
    if (!player) return reply('Register first with ' + prefix + 'register.');
    if (!player.dragons?.length) return reply('You have no dragons yet. Use ' + prefix + 'starter to choose one.');
    return reply('🐉 *Your Dragons*\n\n' + player.dragons.map((d, i) => (i + 1) + '. ' + d.emoji + ' ' + d.species + ' | Lv.' + d.level + ' | ' + d.element).join('\n') + '\n\nUse ' + prefix + 'dragon 1 to inspect your first dragon.');
  }
};
