import {updateDatabase,readDatabase} from '../lib/database.js';
import {challenge,accept,decline,cancelPvp,pvpState} from '../lib/pvp.js';
import {groupId,world} from '../lib/world-events.js';
export default {name:'pvp',requiresStarter:true,description:'Challenge another player to a solo dragon duel',async execute({sender,reply,args,prefix,message}){
 const group=groupId(message.key.remoteJid);if(!group)return reply('PvP is available in WhatsApp groups.');
 const action=(args[0]||'status').toLowerCase();
 if(action==='challenge'){const target=message.message?.extendedTextMessage?.contextInfo?.participant;if(!target)return reply('Reply to a registered player’s message with '+prefix+'pvp challenge.');const r=await updateDatabase(db=>challenge(db,group,sender,target));return reply(r.error||('⚔️ *PvP CHALLENGE*\nChoose an option below.\n\n✅ Accept: '+prefix+'pvp accept\n❌ Refuse: '+prefix+'pvp decline\n\n'))}
 if(action==='accept'){const r=await updateDatabase(db=>accept(db,group,sender));return reply(r.error||'⚔️ PvP accepted! Challenger attacks first. Use '+prefix+'battle fight to see moves, then '+prefix+'battlefight 1-4.')}
 if(action==='decline'||action==='refuse'){const r=await updateDatabase(db=>decline(db,group,sender));return reply(r.error||'❌ PvP challenge refused. The invitation has been cancelled.')}
 if(action==='cancel'||action==='forfeit'){const r=await updateDatabase(db=>cancelPvp(db,group,sender));return reply(r?'⚔️ PvP cancelled.':'No PvP challenge or duel to cancel.')}
 if(action==='status'){const db=await readDatabase(),b=world(db).battles[group],invite=pvpState(db)[group];return reply(b?.kind==='pvp'?'⚔️ PvP duel active. '+(b.turn===sender?'Your turn. Use '+prefix+'battlefight 1-4.':'Waiting for the current player.'):(invite?'⚔️ Pending PvP invitation. Use '+prefix+'pvp accept or '+prefix+'pvp decline.':'No active PvP duel.'))}
 return reply('PvP: reply to someone with '+prefix+'pvp challenge | '+prefix+'pvp accept | '+prefix+'pvp decline | '+prefix+'pvp cancel | '+prefix+'pvp status.');
}};