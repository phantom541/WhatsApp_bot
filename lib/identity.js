import {createHash} from 'node:crypto';
export const phoneDigits=value=>String(value||'').split('@')[0].split(':')[0].replace(/\D/g,'');
export function phoneFromMessage(message){
 const k=message.key||{};
 for(const jid of [k.participantPn,k.senderPn,k.remoteJidPn,k.participant,k.remoteJid]){
  if(typeof jid==='string'&&jid.endsWith('@s.whatsapp.net'))return phoneDigits(jid);
 }
 return null;
}
export function displayName(message){return String(message.pushName||'Dragon Rider').trim().replace(/[\r\n]/g,' ').slice(0,40);}
export function playerTag(name,phone){return String(name||'Dragon Rider').replace(/[^\p{L}\p{N} _-]/gu,'').trim().replace(/\s+/g,'_').slice(0,22)+'#'+createHash('sha256').update(String(phone||'unknown')).digest('hex').slice(0,8).toUpperCase();}
