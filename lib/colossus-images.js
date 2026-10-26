import {existsSync} from 'node:fs';
import {join} from 'node:path';
const ROOT=join(process.cwd(),'assets','colossi');
const IMAGE_NAMES=Object.freeze({lycagon:'lycagon.png',wethermon:'wethermon.png',ctarnidd:'ctarnidd.png',siegwurm:'siegwurm.png',goldhuneenay:'goldhuneenay.png',orchestra:'orchestra.png',death:'death.png'});
export function colossusImagePath(beast){const id=beast?.colossusId||beast?.id;const file=IMAGE_NAMES[id];if(!file)return null;const path=join(ROOT,file);return existsSync(path)?path:null;}
export async function sendColossusMessage(sock,group,beast,caption){const path=colossusImagePath(beast);return sock.sendMessage(group,path?{image:{url:path},caption}:{text:caption});}
