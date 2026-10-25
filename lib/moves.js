const CLASS_MOVES={
 strike:[['Static Jab',13],['Thunder Dive',17],['Arc Burst',21],['Tempest Break',25]],
 stoker:[['Ember Fang',13],['Flame Spiral',17],['Inferno Breath',21],['Pyre Cyclone',25]],
 boulder:[['Stone Bash',13],['Granite Guard',17],['Magma Crush',21],['Quake Hammer',25]],
 mystery:[['Phantom Swipe',13],['Rune Pulse',17],['Shadow Coil',21],['Eclipse Burst',25]],
 tidal:[['Reef Strike',13],['Tidal Surge',17],['Abyss Roar',21],['Maelstrom',25]],
 sharp:[['Quill Slash',13],['Razor Barrage',17],['Saber Dive',21],['Thorn Tempest',25]],
 tracker:[['Scent Rush',13],['Hunter Pounce',17],['Trail Ambush',21],['Alpha Pursuit',25]]
};
export const movesForClass = dragonClass => (CLASS_MOVES[String(dragonClass||'').toLowerCase()]||[]).map(([name,power])=>({name,power}));
export const MOVE_NAMES = ['Quick Strike','Wing Slash','Tail Whip','Dragon Breath','Sky Dive','Claw Rush','Iron Guard','Sonic Blast','Fury Charge','Flame Burst','Rock Crush','Tidal Wave','Razor Storm','Shadow Strike','Thunder Crash','Legendary Roar'];
export const MOVE_POOL = MOVE_NAMES.map((name,i)=>({name,power:8+i*2}));
export function ensureMoves(d) {
 if (!Array.isArray(d.moves)) d.moves=(movesForClass(d.dragonClass||d.element).length?movesForClass(d.dragonClass||d.element):MOVE_POOL.slice(0,4)).map(m=>({...m}));
 if (!Array.isArray(d.lostMoves)) d.lostMoves=[];
}
export function availableMoves(d) {
 ensureMoves(d);
 return MOVE_POOL.filter(m=>!d.moves.some(x=>x.name===m.name)&&!d.lostMoves.includes(m.name));
}
export function replaceMove(d,slot,name) {
 ensureMoves(d);
 if (!(d.moveCredits>0)||d.level>100) return 'No move replacement available.';
 if (!Number.isInteger(slot)||slot<1||slot>4) return 'Select slot 1 through 4.';
 const move=availableMoves(d).find(m=>m.name.toLowerCase()===name.toLowerCase());
 if (!move) return 'That move is unavailable or permanently forgotten.';
 d.lostMoves.push(d.moves[slot-1].name);
 d.moves[slot-1]={...move};
 d.moveCredits--;
 return null;
}
