import {combatStats,dragonProfile} from './dragon-combat-profile.js';
export const PARTY_LIMIT=6;
export function ensureCollection(p) {
 if (!Array.isArray(p.dragons)) p.dragons=[];
 for(const d of p.dragons){
  if(d.species==='Red Fury'){
   const stats=combatStats('Red Fury','strike',d.level,d.powerTier||5);
   const oldMax=d.maxHp||stats.maxHp;
   const ratio=Math.max(0,Math.min(1,(d.hp??oldMax)/oldMax));
   d.maxHp=Math.max(oldMax,stats.maxHp);
   d.hp=Math.round(d.maxHp*ratio);
   d.attack=Math.max(d.attack||0,stats.attack);
   d.defense=Math.max(d.defense||0,stats.defense);
   d.speed=Math.max(d.speed||0,stats.speed);
   d.role='apex';d.combatType='storm';
  }
 }
 if (!Array.isArray(p.party)) p.party=p.dragons.slice(0,PARTY_LIMIT).map(d=>d.id);
 if (!Array.isArray(p.den)) p.den=p.dragons.filter(d=>!p.party.includes(d.id)).map(d=>d.id);
}
export function addDragon(p,d,choice='auto') {
 ensureCollection(p);
 p.dragons.push(d);
 const destination=choice==='den'||p.party.length>=PARTY_LIMIT?'den':'party';
 p[destination].push(d.id);
 return destination;
}
export function activeDragon(p) {
 ensureCollection(p);
 return p.dragons.find(d=>d.id===p.activeDragonId&&p.party.includes(d.id)&&d.hp>0)||
 p.dragons.find(d=>p.party.includes(d.id)&&d.hp>0);
}
