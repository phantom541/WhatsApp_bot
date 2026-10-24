import {phoneDigits} from './identity.js';
const owners=()=>String(process.env.BOT_OWNER_NUMBERS||'').split(',').map(phoneDigits).filter(Boolean);
export function roleOf(db,phone){
 if(phone&&owners().includes(phone))return 'creator';
 if(phone&&db.botOwners?.includes(phone))return 'owner';
 if(phone&&db.botMods?.includes(phone))return 'mod';
 return 'player';
}
export function roleRank(role){return {player:0,mod:1,owner:2,creator:3}[role]||0;}
export function canManage(actor,target){return roleRank(actor)>roleRank(target);}
export function ensureRoles(db){if(!Array.isArray(db.botMods))db.botMods=[];if(!Array.isArray(db.botOwners))db.botOwners=[];}
