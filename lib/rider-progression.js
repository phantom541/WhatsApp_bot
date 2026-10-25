// Twelve dragon-themed ranks, with 42 total phases.
export const RIDER_LEVEL_CAP = 12;
export const RIDER_TITLES = [
 'Emberbound Wyrmling', 'Fangfire Initiate', 'Scaleveil Stalker',
 'Stormclaw Tamer', 'Nightwing Vanguard', 'Inferno Talon',
 'Thundermaw Sovereign', 'Obsidian Drakeheart', 'Eclipse Wyvern',
 'Celestial Dragonlord', 'Elder Wyrm Ascendant', 'Primordial Sky Tyrant'
];
export const riderPhaseCount = level => level >= 10 ? 5 : 3;
export const riderTitle = level => RIDER_TITLES[Math.max(0,Math.min(11,(Number(level)||1)-1))];
export const riderPhase = p => Math.max(1,Math.min(riderPhaseCount(p.riderLevel||1),Math.floor(Number(p.riderPhase)||1)));
export const riderRoman = phase => ['I','II','III','IV','V'][Math.max(0,Math.min(4,phase-1))];
export const riderRank = p => riderTitle(p.riderLevel||1)+' '+riderRoman(riderPhase(p));
export const riderXpNeeded = (level,phase=1) => Math.floor((100*level*level+50*level)*(0.75+phase*0.25));
export const riderScore = p => {
 const level=Math.max(1,Math.min(RIDER_LEVEL_CAP,Number(p.riderLevel)||1));
 return Array.from({length:level-1},(_,i)=>riderPhaseCount(i+1)).reduce((a,b)=>a+b,0)+riderPhase(p);
};
export function awardRiderXp(player,amount) {
 player.riderLevel=Math.max(1,Math.min(RIDER_LEVEL_CAP,Math.floor(Number(player.riderLevel)||1)));
 player.riderPhase=riderPhase(player);
 player.riderXp=Math.max(0,Number(player.riderXp)||0);
 const levels=[];
 if(!Number.isFinite(amount)||amount<=0)return {levels,ascended:false};
 if(player.riderLevel===12&&player.riderPhase===5){
  player.ascensionXp=(player.ascensionXp||0)+Math.floor(amount);
  return {levels,ascended:false};
 }
 player.riderXp+=Math.floor(amount);
 while(player.riderXp>=riderXpNeeded(player.riderLevel,player.riderPhase)){
  player.riderXp-=riderXpNeeded(player.riderLevel,player.riderPhase);
  if(player.riderPhase<riderPhaseCount(player.riderLevel))player.riderPhase++;
  else {player.riderLevel++;player.riderPhase=1;}
  levels.push(riderRank(player));
  if(player.riderLevel===12&&player.riderPhase===5)break;
 }
 const ascended=player.riderLevel===12&&player.riderPhase===5&&!player.ascensionUnlocked;
 if(ascended){
  player.ascensionUnlocked=true;
  player.ascensionXp=player.riderXp;
  player.riderXp=0;
  player.ascensionNotificationPending=true;
 }
 return {levels,ascended};
}
