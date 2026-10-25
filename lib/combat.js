import {recordQuest} from './quests.js';
import {randomInt} from 'node:crypto';
import {awardXp,winXp,lossXp} from './progression.js';
import {activeDragon} from './collection.js';
import {CHARMS} from './catalog.js';
import {ensureMoves} from './moves.js';
export function enemyTurn(p,e){
 const d=activeDragon(p);
 if(!d)return {lost:true};
 const guard=(d.equippedCharm==='guardcharm'?1.1:1)*(p.defenseBoostTurns>0?1.25:1);
 let damage=Math.max(1,e.attack+randomInt(0,5)-Math.floor((d.defense||0)*guard/3));
 if(p.guardNextHit){damage=Math.max(1,Math.ceil(damage/2));p.guardNextHit=false;}
 if(p.defenseBoostTurns>0)p.defenseBoostTurns--;
 d.hp=Math.max(0,d.hp-damage);
 const survivors=p.dragons.some(x=>p.party.includes(x.id)&&x.hp>0);
 if(!survivors){
  const xp=lossXp(e.level);
  p.xp=(p.xp||0)+xp;
  awardXp(d,xp);
  p.activeEncounter=null;
  return {lost:true,damage,xp};
 }
 return {damage,exhausted:d.hp===0};
}
export function useMove(p,slot){
 const e=p.activeEncounter,d=activeDragon(p);
 if(!e)return {error:'No active encounter.'};
 if(!d)return {error:'No healthy party dragon. Use _rest.'};
 ensureMoves(d);
 const m=d.moves[slot-1];
 if(!m)return {error:'Choose move 1 through 4.'};
 const power=(d.equippedCharm==='powercharm'?1.1:1)*(p.attackBoostTurns>0?1.25:1);
 if(p.attackBoostTurns>0)p.attackBoostTurns--;
 const speedBoost=(d.equippedCharm==='swiftcharm'?0.1:0)+(p.speedBoostTurns>0?0.2:0);
 const speedDamage=Math.floor((d.speed||0)*speedBoost);
 const elemental=(p.fireBoostTurns>0&&/flame|fire|breath/i.test(m.name)?5:0)+(p.waterBoostTurns>0&&/tidal|wave|sonic/i.test(m.name)?5:0);
 const focus=p.focusBoostTurns>0?3:0;
 const damage=Math.max(1,Math.floor((d.attack*power+m.power)/2)+speedDamage+elemental+focus+randomInt(0,6)-Math.floor(e.level/2));
 for(const key of ['speedBoostTurns','fireBoostTurns','waterBoostTurns','focusBoostTurns'])if(p[key]>0)p[key]--;
 e.hp=Math.max(0,e.hp-damage);
 if(e.hp===0){
  const xp=Math.floor(winXp(e.level)*(d.equippedCharm==='wisdomcharm'?1.1:1)),coins=10+e.level*5;
  p.xp=(p.xp||0)+xp;p.coins=(p.coins||0)+coins;
  const milestones=awardXp(d,xp);
  p.pendingRecruit={...e};
  p.engagement ||= {}; p.engagement.wins = (p.engagement.wins || 0) + 1;
  recordQuest(p,'win');
  p.activeEncounter=null;
  return {won:true,damage,xp,coins,milestones,species:e.species};
 }
 return {damage,enemy:enemyTurn(p,e),enemyHp:e.hp,move:m.name};
}
