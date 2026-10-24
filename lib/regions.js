import {randomInt} from 'node:crypto';
import {DRAGON_CLASSES} from './dragons.js';
export const REGIONS={
 berk:{name:'Berk Cliffs',classes:['stoker','tracker','sharp'],minLevel:1,maxLevel:8},
 forest:{name:'Whispering Forest',classes:['tracker','mystery','sharp'],minLevel:3,maxLevel:15},
 volcano:{name:'Volcanic Ridge',classes:['stoker','boulder'],minLevel:8,maxLevel:24},
 ocean:{name:'Tidal Depths',classes:['tidal','mystery'],minLevel:12,maxLevel:30},
 storm:{name:'Storm Peaks',classes:['strike','sharp'],minLevel:18,maxLevel:40},
 ruins:{name:'Ancient Ruins',classes:['mystery','boulder','strike'],minLevel:25,maxLevel:55},
 sanctuary:{name:'Hidden Sanctuary',classes:Object.keys(DRAGON_CLASSES),minLevel:35,maxLevel:75}
};
export const RARITIES=['Common','Uncommon','Rare','Epic','Legendary'];
const WEIGHTS=[55,26,12,6,1];
export function chooseRarity(boost=0){
 const weights=WEIGHTS.map((w,i)=>i===0?Math.max(5,w-boost):i===1?w+Math.floor(boost/2):i===2?w+Math.ceil(boost/3):i===3?w+Math.floor(boost/6):w+Math.floor(boost/10));
 const total=weights.reduce((a,b)=>a+b,0);let roll=randomInt(total);
 for(let i=0;i<weights.length;i++){roll-=weights[i];if(roll<0)return RARITIES[i];}
 return RARITIES[0];
}
export function generateWild(regionKey='berk',rareBoost=0){
 const region=REGIONS[regionKey]||REGIONS.berk;
 const cls=region.classes[randomInt(region.classes.length)];
 const group=DRAGON_CLASSES[cls];
 const rarity=chooseRarity(rareBoost);
 const level=randomInt(region.minLevel,region.maxLevel+1);
 const species=group.species[randomInt(group.species.length)];
 const rarityIndex=RARITIES.indexOf(rarity);
 const hp=24+level*9+rarityIndex*12;
 return {id:cryptoRandom(),species,dragonClass:group.label,emoji:group.emoji,level,hp,maxHp:hp,attack:4+level*2+rarityIndex*2,rarity,region:regionKey,createdAt:Date.now()};
}
function cryptoRandom(){return String(randomInt(1,2147483647))+'-'+Date.now();}
