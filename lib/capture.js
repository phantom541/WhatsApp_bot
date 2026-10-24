import {inventoryCount,consumeItem} from './items.js';
export const CAPTURE_TOOLS=Object.freeze({
 basicnet:{bonus:10},strongnet:{bonus:22},masternet:{bonus:40},
 bait:{bonus:8},rarebait:{bonus:15},sleepdust:{bonus:18},calmingherb:{bonus:12}
});
export function prepareCapture(player,key){
 const e=player.activeEncounter;
 if(!e)return {error:'No active wild dragon.'};
 if(!CAPTURE_TOOLS[key])return {error:'Unknown capture supply.'};
 if(e.captureTool)return {error:'A capture supply is already prepared. Try catching first.'};
 if(!inventoryCount(player,key))return {error:'You do not own that supply.'};
 if(!consumeItem(player,key))return {error:'Item not found.'};
 e.captureTool=key;
 return {bonus:CAPTURE_TOOLS[key].bonus};
}
export function captureChance(encounter){
 const base=Math.max(8,Math.min(85,75-encounter.level*2));
 const bonus=CAPTURE_TOOLS[encounter.captureTool]?.bonus||0;
 return Math.min(95,base+bonus);
}
