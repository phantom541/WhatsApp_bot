import {awardColossus} from './colossi.js';
import {awardRiderXp} from './rider-progression.js';
import {recordQuest} from './quests.js';
import {randomInt} from 'node:crypto';
import {awardXp,winXp,lossXp} from './progression.js';
import {activeDragon} from './collection.js';
import {recordColossusDefeat} from './sea-eyes.js';
import {ensureMoves,speciesMoves} from './moves.js';
import {dragonProfile,matchup} from './dragon-combat-profile.js';
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const kind=d=>d.combatType||dragonProfile(d.species,d.dragonClass).type;
export function moveAccuracy(attacker,defender,move){
 const speedDelta=(Number(defender.speed)||0)-(Number(attacker.speed)||0);
 return clamp(Math.round((move.accuracy??90)-clamp(speedDelta*0.30,-12,18)),35,100);
}
export function damageEstimate(attacker,defender,move,boost=1){
 const affinity=matchup(move.type||kind(attacker),kind(defender));
 const offense=(Number(attacker.attack)||1)*0.65*boost+(Number(move.power)||1)*0.80;
 const mitigation=(Number(defender.defense)||0)*0.46;
 return {damage:Math.max(1,Math.round(Math.max(1,offense-mitigation)*affinity.multiplier)),effectiveness:affinity.label,multiplier:affinity.multiplier};
}
export function previewMove(attacker,defender,move){
 return {...damageEstimate(attacker,defender,move),accuracy:moveAccuracy(attacker,defender,move)};
}
function strike(attacker,defender,move,boost=1){
 const accuracy=moveAccuracy(attacker,defender,move);
 if(randomInt(100)>=accuracy)return {damage:0,miss:true,accuracy,effectiveness:'miss'};
 const result=damageEstimate(attacker,defender,move,boost);
 const damage=Math.max(1,result.damage+randomInt(-2,3));
 defender.hp=Math.max(0,defender.hp-damage);
 return {damage,miss:false,accuracy,effectiveness:result.effectiveness};
}
function xpForDefeat(p,d,e){
 const xp=lossXp(e.level);
 p.xp=(p.xp||0)+xp;awardRiderXp(p,xp);awardXp(d,xp);p.activeEncounter=null;
 return xp;
}
export function enemyTurn(p,e){
 const d=activeDragon(p);
 if(!d)return {lost:true};
 const moves=speciesMoves(e),move=moves[randomInt(moves.length)];
 const guard=(d.equippedCharm==='guardcharm'?1.1:1)*(p.defenseBoostTurns>0?1.25:1);
 const attack={...e,attack:e.attack||5},target={...d,defense:(d.defense||0)*guard};
 const hit=strike(attack,target,move);
 let damage=hit.damage;
 if(p.guardNextHit&&damage>0){damage=Math.max(1,Math.ceil(damage/2));p.guardNextHit=false;}
 if(p.defenseBoostTurns>0)p.defenseBoostTurns--;
 d.hp=Math.max(0,d.hp-damage);
 const survivors=p.dragons.some(x=>p.party.includes(x.id)&&x.hp>0);
 if(!survivors)return {lost:true,damage,xp:xpForDefeat(p,d,e),move:move.name,miss:hit.miss,effectiveness:hit.effectiveness};
 return {damage,exhausted:d.hp===0,move:move.name,miss:hit.miss,effectiveness:hit.effectiveness};
}
export function useMove(p,slot){
 const e=p.activeEncounter,d=activeDragon(p);
 if(!e)return {error:'No active encounter.'};
 if(!d)return {error:'No healthy party dragon. Use _rest.'};
 ensureMoves(d);
 const m=d.moves[slot-1];
 if(!m)return {error:'Choose an available move slot.'};
 const speed=(Number(d.speed)||0)*(d.equippedCharm==='swiftcharm'?1.15:1)*(p.speedBoostTurns>0?1.25:1);
 const faster=speed>=(Number(e.speed)||0);
 let incoming=null;
 // Faster dragons ALWAYS act before slower ones, even if they are wild.
 if(!faster){
  incoming=enemyTurn(p,e);
  if(incoming.lost||d.hp<=0)return {move:m.name,damage:0,miss:true,enemy:incoming,enemyHp:e.hp,enemyFirst:true};
 }
 const boost=(d.equippedCharm==='powercharm'?1.1:1)*(p.attackBoostTurns>0?1.25:1);
 const moveBoost=(p.fireBoostTurns>0&&m.type==='ember'?1.15:1)*(p.waterBoostTurns>0&&m.type==='tide'?1.15:1);
 const focusBonus=p.focusBoostTurns>0?1.08:1;
 const speedBonus=d.equippedCharm==='swiftcharm'?1.05:1;
 const hit=strike(d,e,m,boost*moveBoost*focusBonus*speedBonus);
 for(const key of ['attackBoostTurns','speedBoostTurns','fireBoostTurns','waterBoostTurns','focusBoostTurns'])if(p[key]>0)p[key]--;
 if(e.hp===0){
  const xp=Math.floor(winXp(e.level)*(d.equippedCharm==='wisdomcharm'?1.1:1)),coins=10+e.level*5;
  p.xp=(p.xp||0)+xp;p.coins=(p.coins||0)+coins;
  const riderProgress=awardRiderXp(p,xp),milestones=awardXp(d,xp);
  const colossusLocation=e.isColossus?awardColossus(p,e):null;
  const eyeProgress=e.isColossus?recordColossusDefeat(p,e):null;
  p.pendingRecruit=e.isColossus?null:{...e};p.engagement||={};p.engagement.wins=(p.engagement.wins||0)+1;
  recordQuest(p,'win');p.activeEncounter=null;
  return {won:true,damage:hit.damage,miss:false,move:m.name,accuracy:hit.accuracy,effectiveness:hit.effectiveness,enemyFirst:!faster,enemy:incoming,xp,coins,milestones,species:e.species,riderProgress,colossusLocation,eyeProgress};
 }
 if(faster)incoming=enemyTurn(p,e);
 return {damage:hit.damage,miss:hit.miss,accuracy:hit.accuracy,effectiveness:hit.effectiveness,enemy:incoming,enemyHp:e.hp,move:m.name,enemyFirst:!faster};
}
