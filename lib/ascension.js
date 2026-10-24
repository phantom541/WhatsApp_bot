import {consumeItem,inventoryCount} from './items.js';
const CLASS={Strike:'strikestone',Stoker:'stokerstone',Boulder:'boulderstone',Mystery:'mysterystone',Tidal:'tidalstone',Sharp:'sharpstone',Tracker:'trackerstone'};
const ELEMENTS={firestone:['Stoker'],waterstone:['Tidal'],thunderstone:['Strike'],earthstone:['Boulder'],windstone:['Sharp','Tracker'],shadowstone:['Mystery'],lightstone:['Mystery','Strike']};
export const EVOLUTION_STONES=[...Object.keys(ELEMENTS),...Object.values(CLASS),'primalstone','dragonpearl'];
export function evolveDragon(player,slot,key){
 const d=player.dragons?.[slot-1];
 if(!d)return {error:'Dragon not found.'};
 if(player.activeEncounter)return {error:'Cannot evolve in battle.'};
 const stage=d.evolutionStage||0;
 if(stage>=3)return {error:'Already at maximum ascension stage 3.'};
 const minimum=[10,30,60][stage];
 if(d.level<minimum)return {error:'Next ascension requires dragon level '+minimum+'.'};
 if(!EVOLUTION_STONES.includes(key))return {error:'Unknown evolution stone.'};
 const compatible=key===CLASS[d.dragonClass]||key==='primalstone'||key==='dragonpearl'||ELEMENTS[key]?.includes(d.dragonClass);
 if(!compatible)return {error:'Incompatible stone. Recommended: '+CLASS[d.dragonClass]+'.'};
 if(!inventoryCount(player,key))return {error:'You do not own '+key+'.'};
 consumeItem(player,key);
 d.evolutionStage=stage+1;d.maxHp=(d.maxHp||d.hp)+15;d.hp=Math.min(d.maxHp,d.hp+15);d.attack+=3;d.defense+=2;d.speed=(d.speed||0)+1;
 return {message:d.species+' ascended to stage '+d.evolutionStage+'! HP +15, ATK +3, DEF +2, SPD +1.'};
}
