import { DRAGON_CLASSES } from '../lib/dragons.js';
export default {
  name: 'classes', description: 'Explore all seven dragon classes',
  async execute({ reply, args, prefix }) {
    const key = args[0]?.toLowerCase();
    if (!key) return reply('🐉 *Seven Dragon Classes*\n\n' + Object.entries(DRAGON_CLASSES).map(([id, d]) => d.emoji + ' *' + d.label + '* - ' + d.specialty).join('\n') + '\n\nDetails: ' + prefix + 'classes strike');
    const d = DRAGON_CLASSES[key];
    if (!d) return reply('Unknown class. Use ' + prefix + 'classes.');
    return reply(d.emoji + ' *' + d.label + ' Class*\n' + d.specialty + '\n\n*Known species:*\n' + d.species.map(s => '• ' + s).join('\n') + '\n\n*Starter:* ' + d.starter + '\n*Ability:* ' + d.ability);
  }
};
