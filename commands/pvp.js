import {updateDatabase,readDatabase} from '../lib/database.js';
import {challenge,accept,decline,cancelPvp,pvpState} from '../lib/pvp.js';
import {groupId,world} from '../lib/world-events.js';
import {activeDragon} from '../lib/collection.js';
import {battleStartedText} from '../lib/battle-announcement.js';
export default {name:'pvp',requiresStarter:true,description:'Challenge another player to a solo dragon duel',async execute({sender,reply,args,prefix,message,sock}){
 const group=groupId(message.key.remoteJid);if(!group)return reply('PvP is available in WhatsApp groups.');
 const raw=(args[0]||'status').toLowerCase();const action=raw==='--accept'?'accept':raw==='--reject'?'reject':raw;
 if(action==='challenge'){const target=message.message?.extendedTextMessage?.contextInfo?.participant;if(!target)return reply('Reply to a registered player’s message with '+prefix+'pvp challenge.');const r=await updateDatabase(db=>challenge(db,group,sender,target));return reply(r.error||('⚔️ *PvP CHALLENGE*\nChoose an option below.\n\n✅ Accept: '+prefix+'pvp accept\n❌ Refuse: '+prefix+'pvp decline\n\n'))}
 if(action==='accept'){const r=await updateDatabase(db=>accept(db,group,sender));if(r.error)return reply(r.error);const db=await readDatabase(),b=world(db).battles[group],a=db.players[b.player],o=db.players[b.opponent],ad=activeDragon(a),od=activeDragon(o);if(!ad||!od)return reply('Battle could not start because a healthy dragon is unavailable.');const text=battleStartedText([{player:{jid:b.player},dragon:ad},{player:{jid:b.opponent},dragon:od}]);return sock.sendMessage(message.key.remoteJid,{text,mentions:[b.player,b.opponent]},{quoted:message})}
 if(action==='decline'||action==='refuse'||action==='reject'){const r=await updateDatabase(db=>decline(db,group,sender));return reply(r.error||'❌ PvP challenge rejected. The invitation has been cancelled.')}
 if(action==='cancel'||action==='forfeit'){const r=await updateDatabase(db=>cancelPvp(db,group,sender));return reply(r?'⚔️ PvP cancelled.':'No PvP challenge or duel to cancel.')}
 if(action==='status'){const db=await readDatabase(),b=world(db).battles[group],invite=pvpState(db)[group];return reply(b?.kind==='pvp'?'⚔️ PvP duel active. '+(b.turn===sender?'Your turn. Use '+prefix+'battlefight 1-4.':'Waiting for the current player.'):(invite?'⚔️ Pending PvP invitation. Use '+prefix+'pvp --accept or '+prefix+'pvp --reject.':'No active PvP duel.'))}
 return reply('PvP: reply to someone with '+prefix+'pvp challenge | '+prefix+'pvp --accept | '+prefix+'pvp --reject | '+prefix+'pvp cancel | '+prefix+'pvp status.');
}};