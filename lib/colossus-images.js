import {existsSync} from 'node:fs';
import {join} from 'node:path';
const ROOT=join(process.cwd(),'assets','colossi');
const IMAGE_NAMES=Object.freeze({
 lycagon:'Lycanon_ The Nightslayer Colossus.png',
 wethermon:'Wethermon, Guardian of the Floating Ruins.png',
 ctarnidd:'Colossus of the Neon Abyss.png',
 siegwurm:'siegwurm_colossus.png',
 goldhuneenay:'goldhuneenay_colossus.png',
 orchestra:'orchestra_colossus.png',
 death:'death_the_wolf_colossus.png'
});
export function colossusImagePath(beast){const id=beast?.colossusId||beast?.id;const file=IMAGE_NAMES[id];if(!file)return null;const path=join(ROOT,file);return existsSync(path)?path:null;}
export async function sendColossusMessage(sock,group,beast,caption){const path=colossusImagePath(beast);return sock.sendMessage(group,path?{image:{url:path},caption}:{text:caption});}
