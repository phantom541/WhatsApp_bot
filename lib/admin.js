import {phoneDigits} from './identity.js';
import {roleOf,roleRank,ensureRoles} from './roles.js';
export function targetPlayer(db,query){
 const value=String(query||'').trim(),digits=phoneDigits(value);
 const entries=Object.entries(db.players||{});
 const matches=entries.filter(([jid,p])=>p.playerId?.toLowerCase()===value.toLowerCase()||(digits.length>=8&&p.phoneNumber===digits)||(digits.length>=8&&jid.startsWith(digits+'@')));
 return matches.length===1?{jid:matches[0][0],player:matches[0][1]}:null;
}
export function staffState(db){
 ensureRoles(db);
 if(!db.botBans)db.botBans={};
 if(!db.botSettings)db.botSettings={enabled:true};
 if(!Array.isArray(db.auditLog))db.auditLog=[];
}
export function logStaff(db,actor,action,detail){
 staffState(db);
 db.auditLog.push({when:new Date().toISOString(),actor:actor||'unknown',action,detail:String(detail||'').slice(0,160)});
 if(db.auditLog.length>200)db.auditLog.splice(0,db.auditLog.length-200);
}
export function protectedTarget(db,actor,target){return roleRank(roleOf(db,actor))>roleRank(roleOf(db,target));}
export function safeAmount(raw,max=1000000){const n=Number(raw);return Number.isSafeInteger(n)&&n>0&&n<=max?n:null;}
