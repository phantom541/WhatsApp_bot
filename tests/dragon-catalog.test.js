import test from 'node:test';
import assert from 'node:assert/strict';
import {ALL_DRAGON_SPECIES,dragonSpeciesInfo,normalizeDragonName} from '../lib/dragons.js';
import {FRANCHISE_DRAGONS,FRANCHISE_SOURCE} from '../lib/franchise-species.js';
import {ORIGINAL_DRAGONS} from '../lib/dragon-species.js';
import {generateWild,REGIONS,RARITIES} from '../lib/regions.js';
import {ensureMoves,signatureMove} from '../lib/moves.js';
test('bestiary has 500+ unique species and separates origins',()=>{
 assert.ok(ALL_DRAGON_SPECIES.length>=500);
 assert.equal(new Set(ALL_DRAGON_SPECIES.map(d=>normalizeDragonName(d.species))).size,ALL_DRAGON_SPECIES.length);
 assert.equal(ORIGINAL_DRAGONS.length,504);
 assert.ok(FRANCHISE_DRAGONS.length>=100);
 assert.ok(FRANCHISE_SOURCE.startsWith('https://'));
 assert.equal(dragonSpeciesInfo('night-fury').origin,'HTTYD');
});
test('every species has a supported class rarity and bounded tier',()=>{
 for(const d of ALL_DRAGON_SPECIES){
  assert.ok(REGIONS.sanctuary.classes.includes(d.dragonClass),d.species);
  assert.ok(RARITIES.includes(d.rarity),d.species);
  assert.ok(Number.isInteger(d.powerTier)&&d.powerTier>=1&&d.powerTier<=5,d.species);
 }
});
test('wild encounters respect regional class and species rarity',()=>{
 for(const region of Object.keys(REGIONS))for(let i=0;i<40;i++){
  const wild=generateWild(region);
  const species=dragonSpeciesInfo(wild.species);
  assert.ok(species,wild.species);
  assert.equal(wild.rarity,species.rarity);
  assert.ok(REGIONS[region].classes.includes(species.dragonClass));
 }
});
test('each dragon receives four moves with a signature move',()=>{
 for(const d of ALL_DRAGON_SPECIES){
  const dragon={species:d.species,dragonClass:d.dragonClass,powerTier:d.powerTier};
  ensureMoves(dragon);
  assert.equal(dragon.moves.length,4,d.species);
  assert.equal(dragon.moves[3].name,signatureMove(dragon).name);
 }
});
