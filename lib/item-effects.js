import {consumeItem,inventoryCount} from './items.js';
import {activeDragon} from './collection.js';
const HEAL={potion:40,superpotion:100,hyperpotion:200};
export const USABLE_ITEMS=['potion','superpotion','hyperpotion','maxpotion','revive','maxrevive','guardtonic','attacktonic','defensetonic'];
export function useSupply(p,key,slot=0){
 if(!USABLE_ITEMS.includes(key))return {error:'That item does not have an active use yet.'};
 const d=slot>0?p.dragons?.[slot-1]:activeDragon(p);
 if(!d)return {error:'Dragon not found.'};
 if(!inventoryCount(p,key))return {error:'You do not own that item.'};
 const max=d.maxHp||d.hp;
 if(key==='revive'||key==='maxrevive'){
  if(d.hp>0)return {error:'Revives can only be used on exhausted dragons.'};
 }else if(key in HEAL||key==='maxpotion'){
  if(d.hp<=0)return {error:'Use a revive on an exhausted dragon.'};
  if(d.hp>=max)return {error:'Dragon is already at full HP.'};
 }else{
  if(!p.activeEncounter)return {error:'Battle tonics can only be used in battle.'};
  if(d.hp<=0)return {error:'Cannot boost an exhausted dragon.'};
 }
 if(!consumeItem(p,key))return {error:'Item missing.'};
 if(key in HEAL)d.hp=Math.min(max,d.hp+HEAL[key]);
 if(key==='maxpotion'||key==='maxrevive')d.hp=max;
 if(key==='revive')d.hp=Math.max(1,Math.ceil(max/2));
 if(key==='guardtonic')p.guardNextHit=true;
 if(key==='attacktonic')p.attackBoostTurns=3;
 if(key==='defensetonic')p.defenseBoostTurns=3;
 return {dragon:d.species,hp:d.hp,maxHp:max};
}
