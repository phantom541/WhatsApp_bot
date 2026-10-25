export const TYPE_ADVANTAGES={storm:['tide','metal'],ember:['bloom','frost'],tide:['ember','stone'],stone:['storm','venom'],bloom:['tide','stone'],venom:['bloom','shadow'],frost:['storm','venom'],shadow:['frost','metal'],metal:['shadow','ember']};
export const TYPES=Object.keys(TYPE_ADVANTAGES);
export const ROLES={
 apex:{label:'Apex Predator',hp:2.4,atk:2.35,def:2.25,spd:2.5},
 colossus:{label:'HP Sponge',hp:2.35,atk:0.48,def:0.68,spd:0.4},
 bastion:{label:'Fortress',hp:1.48,atk:0.46,def:2.25,spd:0.34},
 glass:{label:'Glass Cannon',hp:0.64,atk:2.05,def:0.54,spd:1.15},
 sprinter:{label:'Speedster',hp:0.65,atk:1.48,def:0.57,spd:2.5},
 artillery:{label:'Heavy Hitter',hp:0.89,atk:2.16,def:0.65,spd:0.53},
 trickster:{label:'Disruptor',hp:0.95,atk:0.91,def:0.84,spd:1.7},
 balanced:{label:'All-Rounder',hp:1,atk:1,def:1,spd:1}
};
const base={strike:'storm',stoker:'ember',boulder:'stone',mystery:'shadow',tidal:'tide',sharp:'metal',tracker:'bloom'};
const special={'Red Fury':['apex','storm'],'Night Fury':['sprinter','shadow'],'Light Fury':['sprinter','frost'],'Skrill':['glass','storm'],'Gronckle':['bastion','stone'],'Thunderdrum':['colossus','tide'],'Deadly Nadder':['glass','venom'],'Monstrous Nightmare':['artillery','ember'],'Hideous Zippleback':['trickster','venom'],'Razorwhip':['sprinter','metal'],'Speed Stinger':['sprinter','venom'],'Snow Wraith':['glass','frost']};
export function speciesHash(name){let n=2166136261;for(const ch of String(name||'Dragon')){n^=ch.charCodeAt(0);n=Math.imul(n,16777619);}return n>>>0;}
export function dragonProfile(species,dragonClass){
 const hash=speciesHash(species),role=Object.keys(ROLES).filter(x=>x!=='apex')[hash%7],type=(hash>>>5)%4===0?TYPES[(hash>>>8)%9]:base[String(dragonClass||'').toLowerCase()]||'shadow';
 const [r,t]=special[species]||[role,type];
 return {role:r,type:t,modifiers:ROLES[r],label:ROLES[r].label};
}
export function matchup(a,d){
 if(a===d)return {multiplier:0.85,label:'resisted'};
 if(TYPE_ADVANTAGES[a]?.includes(d))return {multiplier:1.5,label:'super effective'};
 if(TYPE_ADVANTAGES[d]?.includes(a))return {multiplier:0.65,label:'not very effective'};
 return {multiplier:1,label:'neutral'};
}
export function combatStats(species,dragonClass,level=1,tier=1){
 const p=dragonProfile(species,dragonClass),lv=Math.max(1,Math.floor(Number(level)||1)),scale=1+0.09*(Math.max(1,Math.min(5,Number(tier)||1))-1);
 const result={maxHp:Math.max(18,Math.round((38+lv*7)*p.modifiers.hp*scale)),attack:Math.max(2,Math.round((5+lv*1.65)*p.modifiers.atk*scale)),defense:Math.max(1,Math.round((4+lv*1.18)*p.modifiers.def*scale)),speed:Math.max(1,Math.round((5+lv*1.24)*p.modifiers.spd*scale))};
 if(species==='Red Fury')return {...result,maxHp:Math.max(550,result.maxHp),attack:Math.max(135,result.attack),defense:Math.max(105,result.defense),speed:Math.max(155,result.speed)};
 return result;
}