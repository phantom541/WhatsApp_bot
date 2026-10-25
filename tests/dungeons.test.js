import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {DUNGEONS,dungeonKey,dungeonCaption} from '../lib/dungeons.js';
test('exactly six distinct portals have images and atmospheric captions',async()=>{
 assert.deepEqual(Object.keys(DUNGEONS),['blue','orange','red','purple','black','purple-black']);
 for(const [key,gate] of Object.entries(DUNGEONS)){
  assert.equal(gate.image,key+'.png');
  const image=await readFile(join(dirname(fileURLToPath(import.meta.url)),'..','assets','dungeons',gate.image));
  assert.ok(image.length>1000,'Dungeon image must not be empty');
  assert.equal(image.subarray(0,8).toString('hex'),'89504e470d0a1a0a','Dungeon image must be PNG');
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
