import {ensureMoves} from './moves.js';
import {randomInt} from 'node:crypto';
import {DUNGEONS} from './dungeons.js';
import {activeDragon} from './collection.js';
import {awardXp,winXp} from './progression.js';
export const BESTIARY={
 blue:{mobs:['Frostfang Wolf','Abyss Crawler','Crystal Sentinel'],boss:'Glacior the Frozen Warden'},
 orange:{mobs:['Ember Imp','Magma Hound','Ash Golem'],boss:'Ignarok the Flame Tyrant'},
 red:{mobs:['Crimson Stalker','Bloodstone Knight','Infernal Wyvern'],boss:'Varkhaz the Crimson Sovereign'},
 purple:{mobs:['Phantom Weaver','Void Mage','Mirage Serpent'],boss:'Nyxara Queen of Illusions'},
 black:{mobs:['Shadow Reaper','Obsidian Guardian','Dread Hound'],boss:'Morvath Lord of the Abyss'},
 'purple-black':{mobs:['Rift Stalker','Eclipse Knight','Chaos Wraith'],boss:"Xal'thor the Eclipse Emperor"}
};
export const BOSS_MOVES=Object.freeze({
 blue:[['Frostbite Claw',68,95],['Glacial Spear',90,85],['Whiteout',105,75],['Absolute Zero',135,65],['Icebound Chains',80,90],['Frozen Cataclysm',120,70]],
 orange:[['Ember Crush',70,95],['Magma Surge',95,85],['Volcanic Burst',110,75],['Inferno Crown',140,65],['Lava Lash',85,90],['Pyroclastic Roar',125,70]],
 red:[['Crimson Slash',75,95],['Bloodstone Breaker',95,85],['Scarlet Tempest',115,75],['Sovereign Wrath',145,65],['Ruby Fang',85,90],['Crimson Reckoning',130,70]],
 purple:[['Phantom Needle',70,95],['Mirror Shatter',95,85],['Illusion Storm',110,75],['Queen\'s Mirage',140,65],['Veil Piercer',80,90],['Dreamfall',125,70]],
 black:[['Shadow Rend',75,95],['Obsidian Crush',100,85],['Abyssal Grasp',115,75],['Eternal Darkness',145,65],['Nightfall Claw',90,90],['Void Devourer',130,70]],
 'purple-black':[['Rift Cleave',80,95],['Eclipse Lance',105,85],['Chaos Collapse',125,75],['Final Eclipse',155,65],['Twilight Rupture',95,90],['Astral Oblivion',140,70]]
});
export function dungeonEnemy(key,floor){const rank=Object.keys(DUNGEONS).indexOf(key)+1,level=rank*10+floor*4,boss=floor===10;const b=BESTIARY[key];const name=boss?b.boss:b.mobs[randomInt(b.mobs.length)];const hp=Math.round((65+level*8)*(boss?3.5:1));return {species:name,level,hp,maxHp:hp,attack:Math.round(7+level*1.6)*(boss?2:1),defense:Math.round(5+level*1.25)*(boss?2:1),speed:Math.round(6+level*1.3),boss,dungeonKey:key}}
export function dungeonFight(p,slot){const battle=p.dungeonBattle,d=activeDragon(p);if(!battle)return {error:'No dungeon monster. Use _dungeon next.'};if(!d)return {error:'No healthy dragon. Leave and recover.'};if(![1,2,3,4].includes(slot))return {error:'Select a move from 1 to 4.'};ensureMoves(d);const move=d.moves?.[slot-1];if(!move)return {error:'That move is not available.'};const enemy=battle.enemy;const hit=randomInt(100)<(move.accuracy??90);const damage=hit?Math.max(1,Math.round((d.attack||10)*.65+(move.power||10)*.8-enemy.defense*.45)):0;enemy.hp=Math.max(0,enemy.hp-damage);if(enemy.hp===0){const xp=Math.round(winXp(enemy.level)*(enemy.boss?4:1.5));p.xp=(p.xp||0)+xp;awardXp(d,xp);p.coins=(p.coins||0)+enemy.level*(enemy.boss?100:12);p.dungeonFloor=(p.dungeonFloor||1)+1;p.dungeonBattle=null;if(enemy.boss){p.dungeonClears=(p.dungeonClears||0)+1;p.activeDungeon=null;p.dungeonFloor=0;return {won:true,cleared:true,xp,coins:enemy.level*100}}return {won:true,xp,floor:p.dungeonFloor}}const bossMove=enemy.boss?BOSS_MOVES[enemy.dungeonKey]?.[randomInt(BOSS_MOVES[enemy.dungeonKey].length)]:null;const counterHit=!bossMove||randomInt(100)<bossMove[2];const counter=counterHit?Math.max(1,Math.round(enemy.attack*.3+(bossMove?.[1]||enemy.level*.25)*.7-(d.defense||0)*.2)):0;d.hp=Math.max(0,d.hp-counter);if(!p.dragons.some(x=>p.party.includes(x.id)&&x.hp>0)){p.dungeonBattle=null;p.activeDungeon=null;return {lost:true,damage,counter,bossMove:bossMove?.[0],counterMiss:!counterHit}}return {damage,counter,enemyHp:enemy.hp,dragonHp:d.hp,miss:!hit,bossMove:bossMove?.[0],counterMiss:!counterHit}}
