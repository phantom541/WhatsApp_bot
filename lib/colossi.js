import {randomInt,randomUUID} from 'node:crypto';
export const COLOSSI=Object.freeze([
 {id:'lycagon',name:'Lycagon the Nightslayer',type:'shadow',hp:2900,attack:370,defense:290,speed:380},
 {id:'wethermon',name:'Wethermon the Tombguard',type:'steel',hp:3300,attack:400,defense:340,speed:310},
 {id:'ctarnidd',name:'Ctarnidd of the Abyss',type:'tide',hp:4100,attack:330,defense:400,speed:240},
 {id:'siegwurm',name:'Siegwurm the Sky Ruler',type:'storm',hp:3500,attack:410,defense:330,speed:370},
 {id:'goldhuneenay',name:'Goldhuneenay the Inexhaustible',type:'earth',hp:4800,attack:340,defense:440,speed:200},
 {id:'orchestra',name:'Orchestra of the Doom Echo',type:'mystery',hp:3700,attack:390,defense:310,speed:350}
, {id:'death',name:'Death the Wolf',type:'shadow',hp:3900,attack:430,defense:340,speed:440}
]);
export function createColossus(index=randomInt(COLOSSI.length)){const b=COLOSSI[index];return {...b,id:randomUUID(),colossusId:b.id,species:b.name,level:100,maxHp:b.hp,rarity:'Colossus',isColossus:true,origin:'Shangri-La Frontier',createdAt:Date.now()}}
export function awardColossus(p,enemy,choice='auto'){const d={...enemy,id:randomUUID(),hp:enemy.maxHp,obtainedAt:Date.now(),untradeable:true};p.dragons ||= [];p.party ||= [];p.den ||= [];p.dragons.push(d);const where=choice==='den'||p.party.length>=6?'den':'party';p[where].push(d.id);return where}
