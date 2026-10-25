import { readDatabase } from '../lib/database.js';
import { riderTitle, RIDER_LEVEL_CAP } from '../lib/rider-progression.js';
const safe = s => String(s || 'Rider').replace(/[\r\n*_`~]/g, '').slice(0, 26);
const levelOf = p => Math.max(1, Math.min(RIDER_LEVEL_CAP, Number(p.riderLevel) || 1));
export default {
  name: 'leaderboard',
  description: 'Solo rankings for engagement, wins, coins, dragons, rider levels and titles',
  async execute({ reply, args }) {
    const db = await readDatabase();
    const metric = (args[0] || 'engagement').toLowerCase();
    const metrics = {
      engagement: p => p.engagement?.commands || 0,
      wins: p => p.engagement?.wins || 0,
      coins: p => Math.max(0, Number(p.coins) || 0),
      dragons: p => Array.isArray(p.dragons) ? p.dragons.length : 0,
      level: levelOf,
      titles: levelOf
    };
    if (!Object.hasOwn(metrics, metric)) return reply('📊 Choose: engagement, wins, coins, dragons, level or titles.');
    const rows = Object.values(db.players || {}).filter(Boolean)
      .map(p => ({ name: safe(p.whatsappName), value: metrics[metric](p), level: levelOf(p), xp: Number(p.riderXp) || 0 }))
      .sort((a, b) => b.value - a.value || (metric === 'level' || metric === 'titles' ? b.xp - a.xp : 0) || a.name.localeCompare(b.name)).slice(0, 10);
    return reply('🏆 *DRAGON BOT | ' + metric.toUpperCase() + ' LEADERBOARD*\n━━━━━━━━━━━━━━━━\n' +
      (rows.map((p, i) => (i + 1) + '. ' + p.name + ' • ' +
        (metric === 'titles' || metric === 'level' ? 'Lv ' + p.level + ' · ' + riderTitle(p.level) : p.value.toLocaleString('en-US') + ' · ' + riderTitle(p.level))).join('\n') || 'No riders yet.') +
      '\n━━━━━━━━━━━━━━━━\n🐉 Every rider competes solo.');
  }
};
