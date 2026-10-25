import test from 'node:test';
import assert from 'node:assert/strict';
import {DUNGEONS,dungeonKey,dungeonCaption} from '../lib/dungeons.js';
test('exactly six distinct portals have images and atmospheric captions',()=>{
 assert.deepEqual(Object.keys(DUNGEONS),['blue','orange','red','purple','black','purple-black']);
 for(const [key,gate] of Object.entries(DUNGEONS)){
  assert.equal(gate.image,key+'.jpg');
  assert.ok(gate.description.length>15);
  assert.ok(gate.scry.length>15);
  const caption=dungeonCaption(key,'_');
  assert.match(caption,/Scrying/);
  assert.ok(caption.includes('_dungeon enter '+key));
 }
});
test('gate names normalize and invalid keys are rejected',()=>{
 assert.equal(dungeonKey('PURPLE BLACK'),'purple-black');
 assert.equal(dungeonKey('blue'),'blue');
 assert.equal(dungeonKey('../private'),null);
 assert.equal(dungeonKey(''),null);
});
