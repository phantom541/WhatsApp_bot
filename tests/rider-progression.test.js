import test from 'node:test';
import assert from 'node:assert/strict';
import {awardRiderXp,riderPhaseCount,riderRank,riderScore,riderXpNeeded,RIDER_TITLES} from '../lib/rider-progression.js';
import {playerTag} from '../lib/identity.js';
test('all twelve ranks have unique dragon-themed names and 42 total phases',()=>{
 assert.equal(new Set(RIDER_TITLES).size,12);
 assert.equal(Array.from({length:12},(_,i)=>riderPhaseCount(i+1)).reduce((a,b)=>a+b),42);
 assert.equal(riderRank({riderLevel:9,riderPhase:3}),'Eclipse Wyvern III');
 assert.equal(riderRank({riderLevel:12,riderPhase:5}),'Primordial Sky Tyrant V');
});
test('rank XP thresholds grow and phase ranking is ordered',()=>{
 for(let level=1;level<=12;level++){
  assert.ok(riderXpNeeded(level,2)>riderXpNeeded(level,1));
  if(level<12)assert.ok(riderXpNeeded(level+1,1)>riderXpNeeded(level,1));
 }
 assert.equal(riderScore({riderLevel:12,riderPhase:5}),42);
 assert.ok(riderScore({riderLevel:10,riderPhase:1})>riderScore({riderLevel:9,riderPhase:3}));
});
test('progression unlocks ascension only at final phase, once',()=>{
 const p={riderLevel:12,riderPhase:4,riderXp:0};
 const r=awardRiderXp(p,riderXpNeeded(12,4)+20);
 assert.equal(r.ascended,true);
 assert.equal(p.riderPhase,5);
 assert.equal(p.ascensionUnlocked,true);
 assert.equal(p.ascensionNotificationPending,true);
 assert.equal(p.ascensionXp,20);
 assert.equal(awardRiderXp(p,50).ascended,false);
 assert.equal(p.ascensionXp,70);
});
test('player tags do not contain phone-number suffix',()=>{
 const phone='26770000001',tag=playerTag('Rider',phone);
 assert.ok(!tag.includes(phone));
 assert.ok(!tag.endsWith(phone.slice(-4)));
 assert.match(tag,/^Rider#[0-9A-F]{8}$/);
});
