import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

export async function sendSeaEyeImage(sock,jid,eye,caption,quoted){
  if(!eye?.id) return sock.sendMessage(jid,{text:caption},{quoted});
  try{
    const source=await readFile(new URL('../assets/colossi_eyes/'+encodeURIComponent(eye.id)+'.svg',import.meta.url));
    const image=await sharp(source).png().toBuffer();
    return sock.sendMessage(jid,{image,caption},{quoted});
  }catch(error){
    console.error('Sea Eye image unavailable:',eye.id,error?.message||error);
    return sock.sendMessage(jid,{text:caption},{quoted});
  }
}
