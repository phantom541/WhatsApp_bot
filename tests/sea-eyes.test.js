import test from 'node:test';
import assert from 'node:assert/strict';
import { SEA_EYES, grantSeaEye, recordColossusDefeat } from '../lib/sea-eyes.js';

test('Creator-granted Eye does not consume the next beast milestone reward', () => {
  const player = { seaEyes: [], beastEarnedEyes: [], colossalBeastsDefeated: [] };
  assert.equal(grantSeaEye(player, 'blazz').eye.id, 'blazz');

  recordColossusDefeat(player, { colossusId: 'beast-1' });
  const milestone = recordColossusDefeat(player, { colossusId: 'beast-2' });

  assert.equal(milestone.awarded.length, 1);
  assert.equal(milestone.awarded[0].id, 'sino');
  assert.deepEqual(new Set(player.seaEyes), new Set(['blazz', 'sino']));
});

test('duplicate Colossus defeat cannot award duplicate Eyes', () => {
  const player = { seaEyes: [], beastEarnedEyes: [], colossalBeastsDefeated: [] };
  recordColossusDefeat(player, { colossusId: 'beast-1' });
  const first = recordColossusDefeat(player, { colossusId: 'beast-2' });
  const duplicate = recordColossusDefeat(player, { colossusId: 'beast-2' });

  assert.equal(first.awarded.length, 1);
  assert.equal(duplicate.newDefeat, false);
  assert.equal(duplicate.awarded.length, 0);
});

test('seven unique Colossi complete the Seven Eyes collection without duplicates', () => {
  const player = { seaEyes: [], beastEarnedEyes: [], colossalBeastsDefeated: [] };
  for (let i = 1; i <= 7; i++) recordColossusDefeat(player, { colossusId: 'beast-' + i });

  assert.equal(player.colossalBeastsDefeated.length, 7);
  assert.equal(player.seaEyes.length, 7);
  assert.equal(new Set(player.seaEyes).size, 7);
  assert.deepEqual(new Set(player.seaEyes), new Set(SEA_EYES.map(eye => eye.id)));
});
