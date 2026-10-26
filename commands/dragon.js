import {readDatabase} from '../lib/database.js';
import {describeDragon,dragonSpeciesInfo,dragonSpeciesById,normalizeDragonName,ALL_DRAGON_SPECIES} from '../lib/dragons.js';
import {ensureCollection} from '../lib/collection.js';
const clean=s=>String(s||'').replace(/[\r\n*_~`]/g,'').slice(0,60);
export function lookupDragon(player,query){
 ensureCollection(player);
 const input=String(query||'').trim();
 const number=/^#?\d+$/.test(input)?Number(input):null;
 const matches=number===null?player.dragons.map((d,i)=>({d,i})).filter(({d})=>normalizeDragonName(d.species)===normalizeDragonName(input)):null;
 const owned=number!==null?(number>=1&&number<=player.dragons.length?{d:player.dragons[number-1],i:number-1}:null):matches?.[0];
 const species=owned?dragonSpeciesInfo(owned.d.species):(number!==null?dragonSpeciesById(number):dragonSpeciesInfo(input));
 if(!owned&&!species)return {error:'Dragon not found in your collection or the bestiary.'};
 const d=owned?.d;
 const catalog=species||dragonSpeciesInfo(d?.species);
 const result=['🐉 *DRAGON ARCHIVE*','━━━━━━━━━━━━━━━━'];
 if(catalog)result.push('📖 Bestiary #'+catalog.bestiaryId+' / '+ALL_DRAGON_SPECIES.length);
 if(d){
  result.push(describeDragon(d));
  const party=player.party.indexOf(d.id),den=player.den.indexOf(d.id);
  result.push('📍 Location: '+(party>=0?'Party • Slot '+(party+1)+'/6':den>=0?'Den • Position '+(den+1):'Unassigned'));
  result.push('🔢 Collection ID: '+(owned.i+1));
  if(matches?.length>1)result.push('🐲 You own '+matches.length+' dragons of this species. Use a collection number to inspect another.');
 }else{
  result.push('🐉 *'+clean(catalog.species)+'*','Class: '+clean(catalog.dragonClass),'Rarity: '+clean(catalog.rarity),'Power tier: '+catalog.powerTier+'/5','📍 Location: Not owned');
 }
 if(catalog?.evolutionStage)result.push('✨ Evolution: '+catalog.evolutionStage+'/3 | Base: '+clean(catalog.baseSpecies));
 else result.push('✨ Evolution: Base form');
 result.push('━━━━━━━━━━━━━━━━');
 return {text:result.join('\n')};
}
export default {
 name:'dragon',description:'Look up a dragon by collection number or species name',
 async execute({sender,reply,prefix,args}){
  const player=(await readDatabase()).players?.[sender];
  if(!player)return reply('Register first with '+prefix+'register.');
  const query=args.join(' ').trim();
  if(!query)return reply('Usage: '+prefix+'dragon 1 | '+prefix+'dragon Red Fury | '+prefix+'dragon Ascended Skrill');
  return reply(lookupDragon(player,query).text||lookupDragon(player,query).error);
 }
};
