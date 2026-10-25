import { readDatabase } from '../lib/database.js';
const safe = s => String(s || 'Rider').replace(/[\r\n*_`~]/g, '').slice(0, 26);
export default {
  name: 'leaderboard',
  description: 'Solo rider rankings: engagement, wins, coins and dragon collection',
  async execute({ reply, args }) {
    const db = await readDatabase();
    const metric = (args[0] || 'engagement').toLowerCase();
    const metrics = {
      engagement: p => p.engagement?.commands || 0,
      wins: p => p.engagement?.wins || 0,
      coins: p => Math.max(0, Number(p.coins) || 0),
      dragons: p => Array.isArray(p.dragons) ? p.dragons.length : 0,
      level: p => Math.max(1, Number(p.riderLevel) || 1)
    };
    if (!Object.hasOwn(metrics, metric)) return reply('📊 Choose: engagement, wins, coins, dragons or level.');
    const rows = Object.values(db.players || {}).filter(Boolean)
      .map(p => ({ name: safe(p.whatsappName), value: metrics[metric](p) }))
      .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name)).slice(0, 10);
    return reply('🏆 *DRAGON BOT | ' + metric.toUpperCase() + ' LEADERBOARD*\n━━━━━━━━━━━━━━━━\n' +
      (rows.map((p, i) => (i + 1) + '. ' + p.name + ' • ' + p.value.toLocaleString('en-US')).join('\n') || 'No riders yet.') +
      '\n━━━━━━━━━━━━━━━━\n🐉 Every rider competes solo.');
  }
};
