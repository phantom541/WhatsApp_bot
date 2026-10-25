import test from 'node:test';
import assert from 'node:assert/strict';
import {COLOSSI,createColossus} from '../lib/colossi.js';
import {COLOSSUS_MOVES} from '../lib/colossus-moves.js';
import {speciesMoves,ensureMoves} from '../lib/moves.js';
import {useMove} from '../lib/combat.js';
test('six beasts each have twelve unique, valid moves',()=>{
 assert.equal(COLOSSI.length,6);
 for(const beast of COLOSSI){const moves=COLOSSUS_MOVES[beast.id];assert.equal(moves.length,12);assert.equal(new Set(moves.map(m=>m.name)).size,12);assert.ok(moves.every(m=>m.power>0&&m.accuracy>=65&&m.accuracy<=100));}
});
test('Colossus party loadout exposes all twelve slots',()=>{
 const d=createColossus(0);ensureMoves(d);assert.equal(d.moves.length,12);assert.equal(speciesMoves(d).length,12);assert.equal(d.moves[11].name,COLOSSUS_MOVES.lycagon[11].name);
});
test('captured Colossus can select the twelfth move in combat',()=>{
 const d=createColossus(0);d.speed=999;const p={dragons:[d],party:[d.id],activeDragonId:d.id,activeEncounter:{species:'Training Target',level:1,hp:9999,maxHp:9999,attack:1,defense:1,speed:1}};
 const result=useMove(p,12);assert.equal(result.error,undefined);assert.equal(result.move,COLOSSUS_MOVES.lycagon[11].name);
});
