import {readDatabase} from '../lib/database.js';
import {roleOf,roleRank} from '../lib/roles.js';

// Manual group membership controls. Bot moderator role or higher required.
function parseInvite(raw){
 const input=String(raw||'').trim();
 const match=input.match(/^(?:https?:\/\/)?chat\.whatsapp\.com\/([A-Za-z0-9_-]{10,})\/?(?:\?.*)?$/i);
 return match?.[1]||null;
}
export default {name:'join',description:'Staff command to join a WhatsApp group by invite link',async execute({sock,reply,args,phone}){
 const db=await readDatabase();
 if(roleRank(roleOf(db,phone))<1)return reply('Dragon Bot moderator role or higher required.');
 const code=parseInvite(args[0]);
 if(!code)return reply('Usage: _join https://chat.whatsapp.com/INVITE_CODE');
 try{
  const jid=await sock.groupAcceptInvite(code);
  return reply('🐉 Dragon Bot joined group: '+jid);
 }catch(error){
  console.error('Join group failed:',error);
  return reply('Could not join that group. Check the invite, approval requirements, and WhatsApp permissions.');
 }
}};