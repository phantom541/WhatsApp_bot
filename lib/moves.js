import {dragonProfile,speciesHash,TYPES} from './dragon-combat-profile.js';
// Sixteen distinct techniques per species. Each one carries power, accuracy, and affinity.
const THEMES={
 strike:['Pulse Needle','Skyflash','Aftershock','Voltage Fang','Cloud Step','Surge Claw','Circuit Break','Bolt Spear','Arc Dive','Static Snare','Thundercrest','Cyclone Rush','Stormpiercer','Charged Mirage','Tempest Collapse','Cataclysm'],
 stoker:['Cinder Flick','Coal Breath','Searing Swipe','Ash Spiral','Flare Lash','Blazing Veil','Ember Barrage','Furnace Howl','Pyre Spiral','Molten Bite','Heatwave Crash','Wildfire Rush','Ignition Crest','Solar Furnace','Infernal Bloom','Eruption'],
 boulder:['Pebble Flick','Ridge Slam','Crag Shield','Granite Crush','Dustfront','Stone Snare','Mountain Drop','Iron Hide','Faultline','Obsidian Spike','Meteor Jaw','Bastion Break','Seismic Roar','Buried Avalanche','Monolith Fall','Worldsplitter'],
 mystery:['Gloom Touch','Illusion Step','Spectral Nudge','Nightfall Veil','Whisper Sting','Phantom Snare','Rune Echo','Veil Break','Dusk Pierce','Mirror Coil','Hex Pulse','Nightmare Gaze','Eclipse Fang','Haunting Spiral','Void Shroud','Abyssal Silence'],
 tidal:['Spray Jet','Reef Rake','Current Lash','Undertow','Pressure Drop','Brine Spear','Riptide Shift','Tidal Hammer','Abyss Pulse','Whirlpool Trap','Wavebreaker','Trench Surge','Deepwater Crush','Maelstrom Roar','Oceanic Vortex','Leviathan Wake'],
 sharp:['Pinprick','Quill Flurry','Feather Slice','Razor Slice','Hook Talon','Spine Sweep','Glass Edge','Precision Dive','Scythe Arc','Blade Cyclone','Thorn Ambush','Severing Gust','Silver Barrage','Needle Storm','Saber Tempest','Thousand Cuts'],
 tracker:['Scent Dart','Prowler Step','Trail Scratch','Thicket Sting','Ambush Claw','Hunting Cry','Briar Snare','Stalking Leap','Pack Rush','Predator Bite','Fernlash','Night Trail','Feral Cyclone','Wild Hunt','Hunter Eclipse','Apex Pursuit']
};
const classTypes={strike:'storm',stoker:'ember',boulder:'stone',mystery:'shadow',tidal:'tide',sharp:'metal',tracker:'bloom'};
const accents=['venom','frost','shadow','metal','storm','bloom','tide','ember','stone'];
export const MOVE_NAMES=['Quick Strike','Wing Slash','Tail Whip','Dragon Breath','Sky Dive','Claw Rush','Iron Guard','Sonic Blast','Fury Charge','Flame Burst','Rock Crush','Tidal Wave','Razor Storm','Shadow Strike','Thunder Crash','Legendary Roar'];
export const MOVE_POOL=MOVE_NAMES.map((name,i)=>({name,power:8+i*2,accuracy:90,type:accents[i%accents.length]}));
const klass=d=>String(d?.dragonClass||d?.element||'').toLowerCase();
export function movesForClass(dragonClass){
 const key=String(dragonClass||'').toLowerCase();
 return (THEMES[key]||THEMES.mystery).slice(0,4).map((name,i)=>({name,power:10+i*4,accuracy:96-i*4,type:classTypes[key]||'shadow'}));
}
export function speciesMoves(d){
 const species=String(d?.species||'Dragon'),cls=klass(d),p=dragonProfile(species,cls),hash=speciesHash(species);
 const words=THEMES[cls]||THEMES.mystery;
 const statModifier={colossus:0.47,bastion:0.55,glass:1.34,sprinter:1.06,artillery:1.5,trickster:0.77,balanced:1}[p.role];
 const tier=Math.max(1,Math.min(5,Number(d?.powerTier)||1));
 return words.map((phrase,i)=>{
  const special=i===15;
  const rotated=words[(i+hash%7)%words.length];
  const type=i%5===4?TYPES[(hash+i)%TYPES.length]:p.type;
  const power=Math.max(3,Math.round((9+i*1.45+tier*1.2)*statModifier*(special?1.22:1)));
  const accuracy=Math.max(43,Math.min(100,98-Math.floor(i/2)*3+(p.role==='sprinter'?5:0)-(p.role==='artillery'?6:0)));
  const name=special&&species==='Red Fury'?'Crimson Stormfire':species+' '+(special?'✦ '+rotated:rotated);
  return special&&species==='Red Fury'?{name,power:52,accuracy:82,type:'storm'}:{name,power,accuracy,type};
 });
}
export function signatureMove(d){
 if(d?.species==='Red Fury')return {name:'Crimson Stormfire',power:52,accuracy:82,type:'storm'};
 return speciesMoves(d)[15];
}
export function ensureMoves(d){
 const pool=speciesMoves(d);
 if(!Array.isArray(d.moves))d.moves=[];
 const valid=new Map([...pool,signatureMove(d)].map(m=>[m.name,m]));
 const existing=d.moves.map(m=>valid.get(m?.name)).filter(Boolean);
 // An older four-move loadout is converted to the new species identity automatically.
 if(existing.length!==4||new Set(existing.map(m=>m.name)).size!==4)
  d.moves=[...pool.slice(0,3),signatureMove(d)].map(m=>({...m}));
 else d.moves=existing.map(m=>({...m}));
 if(!Array.isArray(d.lostMoves))d.lostMoves=[];
}
export function availableMoves(d){
 ensureMoves(d);
 const equipped=new Set(d.moves.map(m=>m.name));
 return [...speciesMoves(d),signatureMove(d)].filter(m=>!equipped.has(m.name)&&!d.lostMoves.includes(m.name));
}
export function replaceMove(d,slot,name){
 ensureMoves(d);
 if(!(d.moveCredits>0)||d.level>100)return 'No move replacement available.';
 if(!Number.isInteger(slot)||slot<1||slot>4)return 'Select slot 1 through 4.';
 const move=availableMoves(d).find(m=>m.name.toLowerCase()===String(name).toLowerCase());
 if(!move)return 'That move is unavailable or permanently forgotten.';
 d.lostMoves.push(d.moves[slot-1].name);
 d.moves[slot-1]={...move};
 d.moveCredits--;
 return null;
}
