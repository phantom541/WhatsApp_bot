import test from 'node:test';
import assert from 'node:assert/strict';
import {ALL_DRAGON_SPECIES} from '../lib/dragons.js';
import {dragonProfile,combatStats,matchup} from '../lib/dragon-combat-profile.js';
import {ensureMoves,speciesMoves,signatureMove,availableMoves} from '../lib/moves.js';
import {damageEstimate,moveAccuracy,useMove} from '../lib/combat.js';
import {createCapturedDragon} from '../lib/dragon-factory.js';
test('all species have exactly 16 deterministic identity moves with accuracy and types',()=>{
 for(const info of ALL_DRAGON_SPECIES){
  const d={species:info.species,dragonClass:info.dragonClass,powerTier:info.powerTier};
  const pool=speciesMoves(d);
  assert.equal(pool.length,16,info.species);
  assert.equal(new Set(pool.map(m=>m.name)).size,16,info.species);
  for(const m of pool){assert.ok(m.power>0);assert.ok([65,70,75,80,85,90,95,100].includes(m.accuracy));assert.ok(m.type);}
  ensureMoves(d);
  assert.equal(d.moves.length,4);
  assert.equal(d.moves[3].name,signatureMove(d).name);
  assert.equal(availableMoves(d).length,12,info.species);
 }
});
test('archetypes have intentionally unequal stat distributions',()=>{
 const fast=combatStats('Night Fury','strike',20,5),slow=combatStats('Gronckle','boulder',20,2);
 const sponge=combatStats('Thunderdrum','tidal',20,2),glass=combatStats('Skrill','strike',20,5);
 assert.equal(dragonProfile('Night Fury','strike').role,'sprinter');
 assert.equal(dragonProfile('Gronckle','boulder').role,'bastion');
 assert.equal(dragonProfile('Thunderdrum','tidal').role,'colossus');
 assert.equal(dragonProfile('Skrill','strike').role,'glass');
 assert.ok(fast.speed>slow.speed*3);
 assert.ok(slow.defense>fast.defense);
 assert.ok(sponge.maxHp>glass.maxHp*2);
 assert.ok(glass.attack>slow.attack);
});
test('type strengths and resistances alter damage',()=>{
 const a={species:'Skrill',dragonClass:'Strike',attack:80,speed:30,combatType:'storm'};
 const weak={species:'Tide',dragonClass:'Tidal',defense:10,speed:10,combatType:'tide'};
 const resistant={species:'Rock',dragonClass:'Boulder',defense:10,speed:10,combatType:'stone'};
 const m={name:'Storm Bolt',power:30,accuracy:85,type:'storm'};
 assert.equal(matchup('storm','tide').multiplier,1.5);
 assert.equal(matchup('storm','stone').multiplier,0.65);
 assert.ok(damageEstimate(a,weak,m).damage>damageEstimate(a,resistant,m).damage);
 assert.ok(moveAccuracy(a,weak,m)>0);
});
test('faster dragon takes first turn regardless of side',()=>{
 const slow=createCapturedDragon({species:'Gronckle',level:1});
 const fast=createCapturedDragon({species:'Night Fury',level:10});
 const p={dragons:[slow],party:[slow.id],activeDragonId:slow.id,activeEncounter:{...fast,hp:500,maxHp:500},engagement:{}};
 const r=useMove(p,1);
 assert.equal(r.enemyFirst,true);
 const p2={dragons:[fast],party:[fast.id],activeDragonId:fast.id,activeEncounter:{...slow,hp:500,maxHp:500},engagement:{}};
 const r2=useMove(p2,1);
 assert.equal(r2.enemyFirst,false);
});

test('rare apex and legendary attackers have exceptionally powerful moves',()=>{
 const fury={species:'Red Fury',dragonClass:'strike',powerTier:5};
 const moves=speciesMoves(fury);
 assert.equal(moves[15].name,'Crimson Stormfire');
 assert.ok(moves.some(m=>m.power>=200));
 const stats=combatStats('Red Fury','strike',1,5);
 assert.ok(stats.maxHp>=550&&stats.attack>=135&&stats.defense>=105&&stats.speed>=155);
 assert.equal(dragonProfile('Red Fury','strike').role,'apex');
 const legend=speciesMoves({species:'Skrill',dragonClass:'strike',powerTier:5});
 assert.ok(legend.some(m=>m.power>=200));
});
