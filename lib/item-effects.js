import {consumeItem,inventoryCount} from './items.js';
import {activeDragon} from './collection.js';
import {applyTraining} from './training.js';
export const USABLE_ITEMS=['potion','superpotion','hyperpotion','maxpotion','revive','maxrevive','guardtonic','attacktonic','defensetonic','speedtonic','focusbrew','fireelixir','waterelixir','staminabrew','xpbook','xpmanual','skillscroll','trainingweight','agilityring','defenseplate','bondtreat','ancientscale','furycrystal','volcanicore','oceanheart','skyshard'];
const HEAL={potion:40,superpotion:100,hyperpotion:200,staminabrew:20};
const TRAINING=['xpbook','xpmanual','skillscroll','trainingweight','agilityring','defenseplate','bondtreat','ancientscale','furycrystal','volcanicore','oceanheart','skyshard'];
const TONICS=['guardtonic','attacktonic','defensetonic','speedtonic','focusbrew','fireelixir','waterelixir'];
export function useSupply(p,key,slot=0){
 if(!USABLE_ITEMS.includes(key))return {error:'This item requires a different command or has no direct-use effect.'};
 const d=slot>0?p.dragons?.[slot-1]:activeDragon(p)||p.dragons?.[0];
 if(!d)return {error:'Dragon not found.'};
 if(!inventoryCount(p,key))return {error:'You do not own that item.'};
 const max=d.maxHp||d.hp||1;
 if(['revive','maxrevive'].includes(key)&&d.hp>0)return {error:'Revives require an exhausted dragon.'};
 if((key in HEAL||key==='maxpotion')&&(d.hp<=0||d.hp>=max))return {error:'Dragon must be conscious and below max HP.'};
 if(TONICS.includes(key)){
  if(!p.activeEncounter)return {error:'Battle tonics require an active battle.'};
  if(d.hp<=0)return {error:'Cannot boost an exhausted dragon.'};
 }
 if(key==='bondtreat'&&(d.bond||0)>=100)return {error:'Bond is already maximum.'};
 const result=TRAINING.includes(key)?applyTraining(d,key):null;
 if(TRAINING.includes(key)&&result===null){
  const bonus={ancientscale:['defense',2],furycrystal:['attack',2],volcanicore:['attack',2],oceanheart:['defense',2],skyshard:['speed',2]}[key];
  if(!bonus)return {error:'No available training upgrade.'};
  d[bonus[0]]=(d[bonus[0]]||0)+bonus[1];
 }
 consumeItem(p,key);
 if(key in HEAL)d.hp=Math.min(max,d.hp+HEAL[key]);
 if(key==='maxpotion'||key==='maxrevive')d.hp=max;
 if(key==='revive')d.hp=Math.max(1,Math.ceil(max/2));
 if(key==='guardtonic')p.guardNextHit=true;
 if(key==='attacktonic')p.attackBoostTurns=3;
 if(key==='defensetonic')p.defenseBoostTurns=3;
 if(key==='speedtonic')p.speedBoostTurns=3;
 if(key==='focusbrew')p.focusBoostTurns=3;
 if(key==='fireelixir')p.fireBoostTurns=3;
 if(key==='waterelixir')p.waterBoostTurns=3;
 return {dragon:d.species,hp:d.hp,maxHp:d.maxHp||max,effect:result||key};
}
