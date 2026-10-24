import {updateDatabase} from '../lib/database.js';
import {roleOf,roleRank} from '../lib/roles.js';
import {staffState,logStaff} from '../lib/admin.js';
export default {name:'botmode',description:'Bot staff switch game commands on/off',async execute({phone,reply,args,prefix}){
 const mode=(args[0]||'').toLowerCase();if(!['on','off','status'].includes(mode))return reply('Usage: '+prefix+'botmode on|off|status');
 const result=await updateDatabase(db=>{
 staffState(db);const role=roleOf(db,phone);
 if(roleRank(role)<1)return 'Bot moderator role required.';
 if(mode==='status')return 'Bot mode: '+(db.botSettings.enabled?'ON':'OFF');
 db.botSettings.enabled=mode==='on';logStaff(db,phone,'botmode',mode);
 return 'Bot commands are now '+mode.toUpperCase()+'. Staff recovery commands remain available.';
 });return reply(result);
}};
