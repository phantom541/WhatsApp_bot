import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

const STARTER_IMAGES = Object.freeze({
  skrill: 'Screenshot_20261027-100602 (1).png',
  'monstrous nightmare': 'Screenshot_20261027-101232 (1).png',
  gronckle: 'Screenshot_20261027-101421 (1).png',
  'hideous zippleback': 'Screenshot_20261027-101648 (1).png',
  thunderdrum: 'Screenshot_20261027-101839 (1).png',
  razorwhip: 'Screenshot_20261027-101927 (1).png',
  'deadly nadder': 'Screenshot_20261027-104119 (1).png'
});
export function starterImageFilename(species) {
  return STARTER_IMAGES[String(species||'').trim().toLowerCase()] || null;
}
export async function sendStarterImage(sock, message, species, caption, reply) {
  const filename=starterImageFilename(species);
  if (!filename) return reply(caption);
  try {
    const buffer=await readFile(join(process.cwd(),'assets','starter_dragons',filename));
    return await sock.sendMessage(message.key.remoteJid,{image:buffer,caption},{quoted:message});
  } catch(error) {
    console.error('Starter image unavailable for '+species+':',error);
    return reply(caption);
  }
}
