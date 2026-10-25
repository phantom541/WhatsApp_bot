import {ALL_DRAGON_SPECIES,DRAGON_CLASSES,dragonSpeciesInfo} from '../lib/dragons.js';
const clean=s=>String(s||'').replace(/[\r\n*_~`]/g,'').slice(0,50);
export default {
 name:'species',description:'Browse 500+ dragons by class, rarity, or name',
 async execute({args,reply,prefix}){
  const first=(args[0]||'').toLowerCase();
  if(!first)return reply('🐉 *DRAGON BESTIARY*\n'+ALL_DRAGON_SPECIES.length+' species across seven classes.\nUse '+prefix+'species strike, '+prefix+'species rare 2, or '+prefix+'species Night Fury.');
  let entries,heading,page=1;
  if(DRAGON_CLASSES[first]){
   entries=ALL_DRAGON_SPECIES.filter(d=>d.dragonClass===first);heading=DRAGON_CLASSES[first].label+' Class';
   page=Number(args[1]||1);
  }else if(['common','uncommon','rare','epic','legendary'].includes(first)){
   entries=ALL_DRAGON_SPECIES.filter(d=>d.rarity.toLowerCase()===first);heading=first+' Dragons';
   page=Number(args[1]||1);
  }else{
   const found=dragonSpeciesInfo(args.join(' '));
   if(!found)return reply('Species not found. Use '+prefix+'species to browse.');
   return reply('🐉 *'+clean(found.species)+'*\nClass: '+clean(found.dragonClass)+'\nRarity: '+found.rarity+'\nPower tier: '+found.powerTier+'/5\nOrigin: '+(found.origin==='original'?'Original Dragon Bot':'HTTYD catalog')+'\n'+clean(found.description||'Dragon species from the franchise.'));
  }
  const pages=Math.ceil(entries.length/12);
  if(!Number.isSafeInteger(page)||page<1||page>pages)return reply('Choose a page between 1 and '+pages+'.');
  const lines=entries.slice((page-1)*12,page*12).map(d=>'• '+clean(d.species)+' · '+d.rarity+' · Tier '+d.powerTier);
  return reply('📖 *'+heading.toUpperCase()+'*\nPage '+page+'/'+pages+' | '+entries.length+' species\n'+lines.join('\n')+'\nNext: '+prefix+'species '+first+' '+(page+1));
 }
};
