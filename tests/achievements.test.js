import test from 'node:test';
import assert from 'node:assert/strict';
import {ACHIEVEMENTS,achievementProgress,earnedAchievements,claimAchievement,unlockedTitles,activeTitle,selectTitle} from '../lib/achievements.js';
test('achievement definitions are unique and rewards have valid targets',()=>{
 assert.equal(ACHIEVEMENTS.length,12);
 assert.equal(new Set(ACHIEVEMENTS.map(a=>a.id)).size,12);
 assert.equal(new Set(ACHIEVEMENTS.map(a=>a.title)).size,12);
 for(const a of ACHIEVEMENTS){assert.ok(a.target>0);assert.ok(a.coins>0);}
});
test('achievements claim once and title equipping requires ownership',()=>{
 const p={coins:10,engagement:{commands:100,wins:25},dragons:[],riderLevel:1,riderPhase:1};
 assert.equal(achievementProgress(p,ACHIEVEMENTS[0]),100);
 assert.ok(earnedAchievements(p).some(a=>a.id==='first_victory'));
 assert.match(selectTitle(p,'Iron Fang').error,/not unlocked/);
 const claimed=claimAchievement(p,'first_victory');
 assert.equal(claimed.achievement.coins,150);
 assert.equal(p.coins,160);
 assert.match(claimAchievement(p,'first_victory').error,/already claimed/);
 assert.equal(p.coins,160);
 assert.ok(unlockedTitles(p).includes('Fang Initiate'));
 assert.equal(selectTitle(p,'fang initiate').title,'Fang Initiate');
 assert.equal(activeTitle(p),'Fang Initiate');
 assert.equal(selectTitle(p,'Dragon Rider').title,'Dragon Rider');
});
test('dungeon clear and final rank unlock milestone achievements',()=>{
 const p={dungeonClears:10,riderLevel:12,riderPhase:5};
 assert.ok(earnedAchievements(p).some(a=>a.id==='abyss_walker'));
 assert.ok(earnedAchievements(p).some(a=>a.id==='ascendant'));
 assert.match(claimAchievement({engagement:{wins:0}},'first_victory').error,/not completed/);
});
