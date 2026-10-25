import {TYPE_ADVANTAGES,TYPES} from '../lib/dragon-combat-profile.js';
export default {name:'types',description:'Show the nine elemental combat matchups',async execute({reply}){
 const lines=TYPES.map(type=>{
  const beats=TYPE_ADVANTAGES[type].join(', ');
  const weak=TYPES.filter(other=>TYPE_ADVANTAGES[other].includes(type)).join(', ');
  return '*'+type.toUpperCase()+'* beats '+beats+' | weak to '+weak;
 });
 return reply('🐉 *Dragon combat types*\n'+lines.join('\n')+'\n\nSuper effective: 1.5x | Weak: 0.65x | Same affinity: 0.85x | Other: 1x\nFastest dragon strikes first; every move has its own accuracy.');
}};