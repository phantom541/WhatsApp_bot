import test from 'node:test';
import assert from 'node:assert/strict';
import {challenge,accept,decline,expireInvites,PVP_INVITE_MS,pvpMove,cancelPvp} from '../lib/pvp.js';
import {expireWorld,world,BATTLE_IDLE} from '../lib/world-events.js';
const group='duel@g.us',a='a@s.whatsapp.net',b='b@s.whatsapp.net';
const dragon=id=>({id,species:'Night Fury',dragonClass:'strike',hp:150,maxHp:150,attack:30,defense:12,speed:30,level:10});
const setup=()=>({players:{[a]:{dragons:[dragon('a1')],party:['a1']},[b]:{dragons:[dragon('b1')],party:['b1']}}});
test('PvP invitation accepts only the challenged player',()=>{const db=setup();assert.equal(challenge(db,group,a,b,1000).ok,true);assert.match(accept(db,group,a,1001).error,/Only/);assert.equal(accept(db,group,b,1002).ok,true);assert.equal(world(db).battles[group].kind,'pvp');});
test('PvP turn order prevents unauthorized attacks',()=>{const db=setup();challenge(db,group,a,b,1000);accept(db,group,b,1001);assert.match(pvpMove(db,group,b,1,1002).error,/not your turn/);const first=pvpMove(db,group,a,1,1003);assert.equal(first.miss===true||first.damage>0,true);assert.equal(world(db).battles[group].turn,b);});
test('PvP cancels after two idle minutes',()=>{const db=setup();challenge(db,group,a,b,1000);accept(db,group,b,1001);const events=expireWorld(db,1001+BATTLE_IDLE);assert.match(events[0].text,/PvP battle cancelled/);assert.equal(world(db).battles[group],undefined);});
test('PvP cancellation frees the group',()=>{const db=setup();challenge(db,group,a,b,1000);assert.equal(cancelPvp(db,group,a),true);assert.equal(challenge(db,group,a,b,1001).ok,true);accept(db,group,b,1002);assert.equal(cancelPvp(db,group,b),true);assert.equal(world(db).battles[group],undefined);});

test('PvP challenges expire after three minutes and announce cancellation',()=>{const db=setup();challenge(db,group,a,b,1000);assert.equal(PVP_INVITE_MS,180000);assert.equal(expireInvites(db,1000+179999).length,0);const events=expireInvites(db,1000+180000);assert.equal(events.length,1);assert.match(events[0].text,/cancelled/);assert.equal(db.pvpInvites[group],undefined);assert.match(accept(db,group,b,1000+180001).error,/No active/)});
test('only challenged player can refuse and refusal cancels invitation',()=>{const db=setup();challenge(db,group,a,b,1000);assert.match(decline(db,group,a,1001).error,/Only/);assert.equal(decline(db,group,b,1002).ok,true);assert.equal(expireInvites(db,1000+PVP_INVITE_MS).length,0);assert.match(accept(db,group,b,1003).error,/No active/)});
test('pending invitation prevents overlapping PvP challenges',()=>{const db=setup();challenge(db,group,a,b,1000);assert.match(challenge(db,group,b,a,1001).error,/awaiting a response/)});
