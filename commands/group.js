// Explicit-command-only WhatsApp group administration.
import {phoneDigits} from '../lib/identity.js';

const admin = p => p?.admin === 'admin' || p?.admin === 'superadmin';
const digits = jid => phoneDigits(String(jid||'').split('@')[0]);
function targetFrom(message,args,participants) {
 const ctx=message.message?.extendedTextMessage?.contextInfo;
 const mentions=ctx?.mentionedJid||[];
 const quoted=ctx?.participant;
 const candidate=mentions[0]||quoted||(args[0]&&/^\+?\d{8,15}$/.test(args[0])?digits(args[0])+'@s.whatsapp.net':null);
 if(!candidate)return null;
 return participants.find(p=>p.id===candidate||digits(p.id)===digits(candidate))?.id||null;
}
export default {name:'group',description:'Manual group administration (group admins only)',async execute({sock,message,reply,args,prefix}){
 const jid=message.key.remoteJid;
 if(!jid?.endsWith('@g.us'))return reply('This command only works inside a WhatsApp group.');
 const action=(args[0]||'help').toLowerCase();
 const help='GROUP ADMIN COMMANDS (manual only)\n'+
 ['open - allow all members to send messages','close - admins-only messages','unlock - allow members to edit group info','lock - admins-only group info edits','kick @member - remove member','promote @member - make group admin','demote @member - remove admin','invite - get invite link','revoke - reset invite link','subject New group name','desc New group description','announce Text - send an admin announcement','info - group summary'].map(x=>prefix+'group '+x).join('\n');
 if(action==='help')return reply(help);
 const metadata=await sock.groupMetadata(jid);
 const participants=metadata.participants||[];
 const botId=sock.user?.id;
 const bot=participants.find(p=>digits(p.id)===digits(botId));
 const actorId=message.key.participant||message.key.remoteJid;
 const actor=participants.find(p=>p.id===actorId||digits(p.id)===digits(actorId));
 if(!admin(actor))return reply('Only WhatsApp group admins can use this command.');
 if(!admin(bot))return reply('Make Dragon Bot a WhatsApp group admin first.');
 const target=targetFrom(message,args.slice(1),participants);
 const targetActions=['kick','promote','demote'];
 if(targetActions.includes(action)){
  if(!target)return reply('Mention or reply to a member in this group.');
  if(digits(target)===digits(botId))return reply('Cannot target the bot.');
  if(action==='kick'&&admin(participants.find(p=>p.id===target)))return reply('Demote a group admin first before removing them.');
  if(action==='promote'&&admin(participants.find(p=>p.id===target)))return reply('Member is already an admin.');
  if(action==='demote'&&!admin(participants.find(p=>p.id===target)))return reply('Member is not an admin.');
 }
 try {
  switch(action){
   case 'open': await sock.groupSettingUpdate(jid,'not_announcement');return reply('🔓 Group opened to all members.');
   case 'close': await sock.groupSettingUpdate(jid,'announcement');return reply('🔒 Group closed: admins can send messages.');
   case 'lock': await sock.groupSettingUpdate(jid,'locked');return reply('🔒 Group information locked.');
   case 'unlock': await sock.groupSettingUpdate(jid,'unlocked');return reply('🔓 Members can edit group information.');
   case 'kick':case 'promote':case 'demote':
    await sock.groupParticipantsUpdate(jid,[target],action==='kick'?'remove':action);
    return reply('Group '+action+' completed for '+target.split('@')[0]+'.');
   case 'invite':return reply('Group invite link: https://chat.whatsapp.com/'+await sock.groupInviteCode(jid));
   case 'revoke':await sock.groupRevokeInvite(jid);return reply('Previous group invite link revoked.');
   case 'subject':{
    const name=args.slice(1).join(' ').trim();
    if(!name||name.length>100)return reply('Usage: '+prefix+'group subject New name (max 100 characters)');
    await sock.groupUpdateSubject(jid,name);return reply('Group name updated.');
   }
   case 'desc':{
    const description=args.slice(1).join(' ').trim();
    if(!description||description.length>2048)return reply('Usage: '+prefix+'group desc New description');
    await sock.groupUpdateDescription(jid,description);return reply('Group description updated.');
   }
   case 'announce':{
    const text=args.slice(1).join(' ').trim();
    if(!text||text.length>2000)return reply('Usage: '+prefix+'group announce Your message');
    return reply('📢 GROUP ANNOUNCEMENT\n'+text);
   }
   case 'info':return reply('GROUP INFO\nName: '+metadata.subject+'\nMembers: '+participants.length+'\nAdmins: '+participants.filter(admin).length+'\nGroup ID: '+jid);
   default:return reply(help);
  }
 }catch(error){console.error('Group admin action failed:',error);return reply('WhatsApp rejected the group action. Check group permissions and try again.');}
}};
