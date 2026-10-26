import test from 'node:test';
import assert from 'node:assert/strict';
import {BESTIARY,BOSS_MOVES,dungeonEnemy} from '../lib/dungeon-combat.js';
import {MONSTER_MOVES} from '../lib/dungeon-monster-moves.js';

test('every dungeon monster has five distinct named attacks',()=>{
 const all=Object.values(BESTIARY).flatMap(d=>d.mobs);
 assert.equal(all.length,30);
 assert.equal(new Set(all).size,30);
 assert.equal(Object.keys(MONSTER_MOVES).length,30);
 const names=[];
 for(const species of all){
  const moves=MONSTER_MOVES[species];
  assert.equal(moves?.length,5,species);
  for(const [name,power,accuracy] of moves){
   assert.ok(name.length>2);
   assert.ok(power>0);
   assert.ok(accuracy>=1&&accuracy<=100);
   names.push(name);
  }
 }
 assert.equal(new Set(names).size,150);
});
test('bosses keep six moves and regular monsters retain dungeon identity',()=>{
 for(const key of Object.keys(BESTIARY)){
  assert.equal(BOSS_MOVES[key].length,6);
  const monster=dungeonEnemy(key,1);
  assert.equal(monster.dungeonKey,key);
  assert.ok(BESTIARY[key].mobs.includes(monster.species));
  assert.equal(monster.boss,false);
  const boss=dungeonEnemy(key,10);
  assert.equal(boss.boss,true);
  assert.equal(boss.species,BESTIARY[key].boss);
 }
});
