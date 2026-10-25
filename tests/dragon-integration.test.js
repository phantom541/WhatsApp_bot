import test from 'node:test';
import assert from 'node:assert/strict';
import {ALL_DRAGON_SPECIES,createStarter,dragonSpeciesInfo,isDragonTradable} from '../lib/dragons.js';
import {BOOK_DRAGONS} from '../lib/book-species.js';
import {createCapturedDragon} from '../lib/dragon-factory.js';
import {generateWild,REGIONS} from '../lib/regions.js';
import {hasStarter} from '../lib/eligibility.js';
import {awardXp} from '../lib/progression.js';
import {ensureMoves,signatureMove} from '../lib/moves.js';

test('franchise legendary rarity is preserved',()=>{
 assert.equal(dragonSpeciesInfo('Night Fury').rarity,'Legendary');
 assert.equal(dragonSpeciesInfo('Night Fury').powerTier,5);
});
test('all catalog species are capturable and recruitable',()=>{
 for(const species of ALL_DRAGON_SPECIES){
  const d=createCapturedDragon({species:species.species,level:5,maxHp:80,attack:20});
  assert.ok(d,species.species);
  assert.equal(d.species,species.species);
  assert.equal(d.rarity,species.rarity);
  assert.equal(d.powerTier,species.powerTier);
  assert.ok(d.attack>0&&d.defense>0&&d.speed>0);
  ensureMoves(d);
  assert.equal(d.moves.length,4);
 }
});
test('book species are included in encounter catalog',()=>{
 assert.ok(BOOK_DRAGONS.length>=100);
 for(const d of BOOK_DRAGONS)assert.ok(dragonSpeciesInfo(d.species),d.species);
});
test('starters begin weak but improve faster at high levels',()=>{
 const d=createStarter('Skrill');
 assert.ok(d.hp<=35&&d.attack<=6&&d.defense<=5);
 const before={hp:d.maxHp,attack:d.attack,defense:d.defense,speed:d.speed};
 awardXp(d,200000);
 assert.equal(d.level,100);
 assert.ok(d.maxHp>before.hp+400);
 assert.ok(d.attack>before.attack+200);
 assert.ok(d.defense>before.defense+40);
 assert.ok(d.speed>before.speed+60);
});
test('creator-bound Red Fury is not tradable or mistaken for starter',()=>{
 const d=createCapturedDragon({species:'Red Fury',level:25,maxHp:500,attack:100});
 assert.equal(d.rarity,'Legendary');
 assert.equal(signatureMove(d).name,'Crimson Stormfire');
 d.creatorBound=true;
 assert.equal(isDragonTradable(d),false);
 assert.equal(hasStarter({dragons:[d]}),false);
 assert.equal(hasStarter({dragons:[d,createStarter('Skrill')]}),true);
});
test('Red Fury cannot enter regular rarity pools',()=>{
 for(const region of Object.keys(REGIONS))for(let i=0;i<20;i++){
  const d=generateWild(region);
  assert.ok(dragonSpeciesInfo(d.species));
  assert.equal(d.rarity,dragonSpeciesInfo(d.species).rarity);
 }
});
