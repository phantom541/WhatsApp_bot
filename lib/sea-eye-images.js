import {readFile} from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const ROOT=join(dirname(fileURLToPath(import.meta.url)),'..','assets','colossi_eyes');

export async function sendSeaEyeImage(sock,jid,eye,caption,quoted){
  if(!eye?.id) return sock.sendMessage(jid,{text:caption},{quoted});
  try{
    const source=await readFile(join(ROOT,eye.id+'.svg'));
    const image=await sharp(source).png().toBuffer();
    return sock.sendMessage(jid,{image,caption},{quoted});
  }catch(error){
    console.error('Sea Eye image unavailable:',eye.id,error?.message||error);
    return sock.sendMessage(jid,{text:caption},{quoted});
  }
}
