import { updateDatabase } from '../lib/database.js';
import { roleOf } from '../lib/roles.js';
import { targetPlayer, logStaff } from '../lib/admin.js';
import { phoneDigits } from '../lib/identity.js';
import { grantSeaEye } from '../lib/sea-eyes.js';

export default {
  name: 'grant-eye',
  description: 'Creator-only grant of a Sea Eye to a registered player',
  async execute({ phone, reply, args, prefix }) {
    const target = phoneDigits(args[0]);
    const eyeId = String(args[1] || '').toLowerCase();
    if (target.length < 8 || !eyeId) {
      return reply('Usage: ' + prefix + 'grant-eye NUMBER blazz\nEyes: blazz, sino, dezer, aeria, beru, vapir, zite');
    }
    const result = await updateDatabase(db => {
      if (roleOf(db, phone) !== 'creator') return { error: '⛔ Only the Creator can grant a Sea Eye.' };
      const found = targetPlayer(db, target);
      if (!found) return { error: 'Player not found. The target must be registered.' };
      const granted = grantSeaEye(found.player, eyeId);
      if (granted.error) return granted;
      logStaff(db, phone, 'grant sea eye', granted.eye.name + ' granted to registered rider');
      return { playerName: found.player.whatsappName || 'Dragon Rider', eye: granted.eye };
    });
    if (result.error) return reply(result.error);
    return reply('👁️ *CREATOR’S GRANT*\nThe Eye of ' + result.eye.name + ' (' + result.eye.power + ') has been bestowed upon ' + result.playerName + '.\nThe Seven Seas acknowledge your decree.');
  }
};
