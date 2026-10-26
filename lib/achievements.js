import {riderScore} from './rider-progression.js';

// Achievements are earned from permanent counters, not daily quest progress.
// Claiming is explicit and idempotent. Rank titles remain separate.
export const ACHIEVEMENTS=Object.freeze([
 {id:'first_steps',name:'First Steps',title:'Newborn Flame',metric:'commands',target:10,coins:100},
 {id:'active_rider',name:'Active Rider',title:'Flamekeeper',metric:'commands',target:100,coins:500},
 {id:'legendary_presence',name:'Legendary Presence',title:'Eternal Flame',metric:'commands',target:1000,coins:5000},
 {id:'first_victory',name:'First Victory',title:'Fang Initiate',metric:'wins',target:1,coins:150},
 {id:'battle_hardened',name:'Battle Hardened',title:'Iron Fang',metric:'wins',target:25,coins:1200},
 {id:'warbringer',name:'Warbringer',title:'Storm Conqueror',metric:'wins',target:100,coins:5000},
 {id:'dragon_keeper',name:'Dragon Keeper',title:'Scale Collector',metric:'dragons',target:5,coins:300},
 {id:'dragon_master',name:'Dragon Master',title:'Keeper of Fifty',metric:'dragons',target:50,coins:3000},
 {id:'gatebreaker',name:'Gatebreaker',title:'Gatebreaker',metric:'dungeons',target:1,coins:800},
 {id:'abyss_walker',name:'Abyss Walker',title:'Abyss Walker',metric:'dungeons',target:10,coins:5000},
 {id:'rising_star',name:'Rising Star',title:'Skybound',metric:'rank',target:10,coins:400},
 {id:'ascendant',name:'Ascendant',title:'Primordial Ascendant',metric:'rank',target:42,coins:10000}
]);
export function achievementProgress(p,a){
 switch(a.metric){
 case 'commands':return Math.max(0,Number(p.engagement?.commands)||0);
 case 'wins':return Math.max(0,Number(p.engagement?.wins)||0);
 case 'dragons':return p.dragons?.length||0;
 case 'dungeons':return Math.max(0,Number(p.dungeonClears)||0);
 case 'rank':return riderScore(p);
 default:return 0;
 }
}
export function earnedAchievements(p){return ACHIEVEMENTS.filter(a=>achievementProgress(p,a)>=a.target);}
export function unlockedTitles(p){return ['Dragon Rider',...ACHIEVEMENTS.filter(a=>p.achievementsClaimed?.includes(a.id)).map(a=>a.title)];}
export function activeTitle(p){const available=unlockedTitles(p);return available.includes(p.selectedTitle)?p.selectedTitle:'Dragon Rider';}
export function claimAchievement(p,id){
 const a=ACHIEVEMENTS.find(a=>a.id===id);
 if(!a)return {error:'Unknown achievement. Use _achievements to view the list.'};
 if(achievementProgress(p,a)<a.target)return {error:'Achievement not completed yet.'};
 p.achievementsClaimed??=[];
 if(p.achievementsClaimed.includes(id))return {error:'Achievement already claimed.'};
 p.achievementsClaimed.push(id);
 p.coins=(Number(p.coins)||0)+a.coins;
 return {achievement:a};
}
export function selectTitle(p,title){
 const match=unlockedTitles(p).find(t=>t.toLowerCase()===String(title).trim().toLowerCase());
 if(!match)return {error:'Title not unlocked. Claim its achievement first.'};
 p.selectedTitle=match;return {title:match};
}
