import test from 'node:test';
import assert from 'node:assert/strict';
import {speciesLore} from '../lib/species-lore.js';
import {REGIONS,generateWild} from '../lib/regions.js';
import {dragonSpeciesInfo,dragonSpeciesById} from '../lib/dragons.js';

test('starter species have lore records',()=>{
 for(const name of ['Skrill','Monstrous Nightmare','Gronckle','Hideous Zippleback','Thunderdrum','Razorwhip','Deadly Nadder']){
  assert.ok(speciesLore(name)?.habitat,name);
  assert.ok(dragonSpeciesInfo(name),name);
 }
});
test('wild encounters always select valid species across regions',()=>{
 for(const region of Object.keys(REGIONS))for(let i=0;i<50;i++){
  const wild=generateWild(region);
  assert.ok(wild.species,region);
  assert.ok(dragonSpeciesInfo(wild.species),wild.species);
  assert.ok(wild.maxHp>0);
 }
});
test('bestiary lookup resolves indexed species',()=>{
 assert.ok(dragonSpeciesById(1));
 assert.equal(dragonSpeciesById(-1),null);
});
