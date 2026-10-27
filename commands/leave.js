import {readDatabase} from '../lib/database.js';
import {roleOf,roleRank} from '../lib/roles.js';

// Manual departure. In-group usage needs no group ID; private-chat usage needs one.
export default {name:'leave',description:'Staff command to leave a WhatsApp group',async execute({sock,message,reply,args,phone}){
 const db=await readDatabase();
 if(roleRank(roleOf(db,phone))<1)return reply('Dragon Bot moderator role or higher required.');
 const current=message.key.remoteJid;
 const jid=current?.endsWith('@g.us')?current:args[0];
 if(!/^\d+(?:-\d+)?@g\.us$/.test(jid||''))return reply('Usage: _leave (inside a group) or _leave GROUP_ID (in private chat).');
 try{
  const metadata=await sock.groupMetadata(jid);
  const botId=String(sock.user?.id||'').split(':')[0].split('@')[0];
  if(!metadata.participants?.some(p=>String(p.id).split(':')[0].split('@')[0]===botId))return reply('Bot is not a member of that group.');
  await reply('🐉 Dragon Bot is leaving this group by staff command.');
  await sock.groupLeave(jid);
 }catch(error){
  console.error('Leave group failed:',error);
  return reply('Could not leave the group. Check the group ID and WhatsApp connection.');
 }
}};