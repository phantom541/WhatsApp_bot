import {randomInt} from 'node:crypto';
import {awardXp,winXp,lossXp} from './progression.js';
import {activeDragon} from './collection.js';
import {ensureMoves} from './moves.js';
export function enemyTurn(p,e){
 const d=activeDragon(p);
 if(!d)return {lost:true};
 const damage=Math.max(1,e.attack+randomInt(0,5)-Math.floor((d.defense||0)/3));
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
 const damage=Math.max(1,Math.floor((d.attack+m.power)/2)+randomInt(0,6)-Math.floor(e.level/2));
 e.hp=Math.max(0,e.hp-damage);
 if(e.hp===0){
  const xp=winXp(e.level),coins=10+e.level*5;
  p.xp=(p.xp||0)+xp;p.coins=(p.coins||0)+coins;
  const milestones=awardXp(d,xp);
  p.pendingRecruit={...e};
  p.activeEncounter=null;
  return {won:true,damage,xp,coins,milestones,species:e.species};
 }
 return {damage,enemy:enemyTurn(p,e),enemyHp:e.hp,move:m.name};
}
