import sharp from 'sharp';

const IMAGE_BASE='https://dragon-bot-images.vercel.app/assets/colossi_eyes/';

export async function sendSeaEyeImage(sock,jid,eye,caption,quoted){
  if(!eye?.id) return sock.sendMessage(jid,{text:caption},{quoted});
  try{
    const response=await fetch(IMAGE_BASE+encodeURIComponent(eye.id)+'.svg');
    if(!response.ok) throw new Error('HTTP '+response.status);
    const source=Buffer.from(await response.arrayBuffer());
    const image=await sharp(source).png().toBuffer();
    return sock.sendMessage(jid,{image,caption},{quoted});
  }catch(error){
    console.error('Sea Eye image unavailable:',eye.id,error?.message||error);
    return sock.sendMessage(jid,{text:caption},{quoted});
  }
}
