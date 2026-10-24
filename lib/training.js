import {awardXp} from './progression.js';
import {availableMoves,ensureMoves} from './moves.js';
export function applyTraining(dragon,key){
 if(key==='xpbook'||key==='xpmanual'){const amount=key==='xpbook'?100:250;const levels=awardXp(dragon,amount);return 'Gained '+amount+' XP'+(levels.length?' and unlocked move milestones!':'')+'.';}
 if(key==='skillscroll'){
  ensureMoves(dragon);
  const options=availableMoves(dragon);
  if(!options.length)return null;
  // Skill Scroll improves attack rather than bypassing the irreversible level-gated move system.
  dragon.attack+=1;return 'Training raised ATK by 1. Move swaps remain level-gated.';
 }
 if(key==='trainingweight'){dragon.attack+=1;return 'ATK +1.';}
 if(key==='agilityring'){dragon.speed=(dragon.speed||0)+1;return 'SPD +1.';}
 if(key==='defenseplate'){dragon.defense+=1;return 'DEF +1.';}
 if(key==='bondtreat'){dragon.bond=Math.min(100,(dragon.bond||0)+10);return 'Bond +10.';}
 return null;
}
