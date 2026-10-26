import test from 'node:test';
import assert from 'node:assert/strict';
import {ALL_DRAGON_SPECIES,BASE_DRAGON_SPECIES,dragonSpeciesInfo,dragonSpeciesById,evolvedSpeciesName} from '../lib/dragons.js';
import {lookupDragon} from '../commands/dragon.js';
import {evolveDragon} from '../lib/ascension.js';
test('evolved forms are distinct indexed species with stable base IDs',()=>{
 assert.equal(ALL_DRAGON_SPECIES.length,BASE_DRAGON_SPECIES.length*4);
 assert.equal(dragonSpeciesInfo('Red Furry').species,'Red Fury');
 assert.equal(dragonSpeciesInfo('Ascended Skrill').evolutionStage,1);
 assert.equal(dragonSpeciesInfo('Elder Skrill').evolutionStage,2);
 assert.equal(dragonSpeciesInfo('Primal Skrill').evolutionStage,3);
 assert.equal(dragonSpeciesById(dragonSpeciesInfo('Skrill').bestiaryId).species,'Skrill');
 assert.equal(evolvedSpeciesName('Skrill',3),'Primal Skrill');
});
test('dragon lookup reports collection number and exact party/den position',()=>{
 const a={id:'a',species:'Skrill',dragonClass:'Strike',level:10,xp:0,hp:20,maxHp:20,attack:10,defense:5,speed:6};
 const b={...a,id:'b',species:'Red Fury'};
 const p={dragons:[a,b],party:['b'],den:['a']};
 assert.match(lookupDragon(p,'1').text,/Den • Position 1/);
 assert.match(lookupDragon(p,'Red Furry').text,/Party • Slot 1\/6/);
 assert.match(lookupDragon(p,'Ascended Skrill').text,/Not owned/);
});
test('evolving changes species but preserves individual identity',()=>{
 const d={id:'dragon-one',species:'Skrill',dragonClass:'Strike',level:70,hp:100,maxHp:100,attack:30,defense:20,speed:15};
 const p={dragons:[d],inventory:[{id:'strikestone',quantity:3}]};
 // Use a minimal compatible inventory structure to exercise the real evolution path.
 const r=evolveDragon(p,1,'strikestone');
 assert.ok(!r.error,r.error);
 assert.equal(d.id,'dragon-one');
 assert.equal(d.species,'Ascended Skrill');
 assert.equal(d.baseSpecies,'Skrill');
 assert.equal(d.evolutionStage,1);
});
