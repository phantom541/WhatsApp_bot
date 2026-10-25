import { readDatabase } from '../lib/database.js';
import { roleOf } from '../lib/roles.js';

// Only the creator can inspect moderation history. Never print raw IDs or phone numbers.
const redact = value => String(value ?? '')
  .replace(/\+?\d[\d\s().-]{6,}\d/g, '[redacted]')
  .replace(/\b\d{6,}\b/g, '[redacted]')
  .replace(/\b[^\s@]+@(?:s\.whatsapp\.net|lid|g\.us)\b/gi, '[redacted]');
export default {
  name: 'stafflog',
  description: 'Creator-only, privacy-safe audit history',
  async execute({ phone, reply }) {
    const db = await readDatabase();
    if (roleOf(db, phone) !== 'creator') return reply('⛔ Creator access required.');
    const rows = (db.auditLog || []).slice(-15).reverse();
    const lines = rows.map(entry => {
      const time = Number.isNaN(Date.parse(entry.when)) ? 'Unknown time' : new Date(entry.when).toISOString().slice(0, 16);
      return '▫️ ' + time + ' | ' + redact(entry.action);
    });
    return reply('📜 *DRAGON BOT | CREATOR AUDIT*\n━━━━━━━━━━━━━━━━\n' +
      (lines.join('\n') || 'No recorded actions.') +
      '\n━━━━━━━━━━━━━━━━\n🔒 Personal identifiers hidden');
  }
};
