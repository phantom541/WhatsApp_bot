export const MOVE_NAMES = ['Quick Strike','Wing Slash','Tail Whip','Dragon Breath','Sky Dive','Claw Rush','Iron Guard','Sonic Blast','Fury Charge','Flame Burst','Rock Crush','Tidal Wave','Razor Storm','Shadow Strike','Thunder Crash','Legendary Roar'];
export const MOVE_POOL = MOVE_NAMES.map((name,i)=>({name,power:8+i*2}));
export function ensureMoves(d) {
 if (!Array.isArray(d.moves)) d.moves=MOVE_POOL.slice(0,4).map(m=>({...m}));
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
