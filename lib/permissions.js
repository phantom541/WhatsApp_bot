import {config} from '../config.js';
const bare=jid=>String(jid||'').split('@')[0].split(':')[0].replace(/\D/g,'');
export async function isRegionSelector(sock,message,sender){
 const authorized=(process.env.BOT_OWNER_JIDS||process.env.BOT_OWNER_NUMBERS||'').split(',').map(bare).filter(Boolean);
 const bot=bare(sock.user?.id);
 if(authorized.includes(bare(sender))||(bot&&bot===bare(sender)))return true;
 const group=message.key.remoteJid;
 if(!group?.endsWith('@g.us'))return false;
 try {
  const metadata=await sock.groupMetadata(group);
  return metadata.participants.some(p=>p.id===sender&&['admin','superadmin'].includes(p.admin));
 }catch{return false;}
}
