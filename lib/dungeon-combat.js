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
export function dungeonEnemy(key,floor){const rank=Object.keys(DUNGEONS).indexOf(key)+1,level=rank*10+floor*4,boss=floor===10;const b=BESTIARY[key];const name=boss?b.boss:b.mobs[randomInt(b.mobs.length)];const hp=Math.round((65+level*8)*(boss?3.5:1));return {species:name,level,hp,maxHp:hp,attack:Math.round(7+level*1.6)*(boss?2:1),defense:Math.round(5+level*1.25)*(boss?2:1),speed:Math.round(6+level*1.3),boss}}
export function dungeonFight(p,slot){const battle=p.dungeonBattle,d=activeDragon(p);if(!battle)return {error:'No dungeon monster. Use _dungeon next.'};if(!d)return {error:'No healthy dragon. Leave and recover.'};if(![1,2,3,4].includes(slot))return {error:'Select a move from 1 to 4.'};const move=d.moves?.[slot-1];if(!move)return {error:'That move is not available.'};const enemy=battle.enemy;const hit=randomInt(100)<(move.accuracy??90);const damage=hit?Math.max(1,Math.round((d.attack||10)*.65+(move.power||10)*.8-enemy.defense*.45)):0;enemy.hp=Math.max(0,enemy.hp-damage);if(enemy.hp===0){const xp=Math.round(winXp(enemy.level)*(enemy.boss?4:1.5));p.xp=(p.xp||0)+xp;awardXp(d,xp);p.coins=(p.coins||0)+enemy.level*(enemy.boss?100:12);p.dungeonFloor=(p.dungeonFloor||1)+1;p.dungeonBattle=null;if(enemy.boss){p.dungeonClears=(p.dungeonClears||0)+1;p.activeDungeon=null;p.dungeonFloor=0;return {won:true,cleared:true,xp,coins:enemy.level*100}}return {won:true,xp,floor:p.dungeonFloor}}const counter=Math.max(1,Math.round(enemy.attack*.45-(d.defense||0)*.2));d.hp=Math.max(0,d.hp-counter);if(!p.dragons.some(x=>p.party.includes(x.id)&&x.hp>0)){p.dungeonBattle=null;p.activeDungeon=null;return {lost:true,damage,counter}}return {damage,counter,enemyHp:enemy.hp,dragonHp:d.hp,miss:!hit}}
