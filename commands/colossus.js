import {updateDatabase,readDatabase} from '../lib/database.js';
import {COLOSSI,createColossus} from '../lib/colossi.js';
import {roleOf,roleRank} from '../lib/roles.js';
import {groupId,world,createSpawn,COLOSSUS_INTERVAL} from '../lib/world-events.js';
export default {name:'colossus',requiresStarter:true,description:'Seven Colossi world anomalies',async execute({sender,reply,args,phone,message,prefix}){
 const action=(args[0]||'list').toLowerCase(),group=groupId(message.key.remoteJid);
 if(action==='list')return reply('🌌 *Seven Colossi*\n'+COLOSSI.map((b,i)=>(i+1)+'. '+b.name).join('\n')+'\n7. [Creator to name]\n\nOne random anomaly every three days.');
 if(action==='status'){const db=await readDatabase(),w=world(db),wait=Math.max(0,COLOSSUS_INTERVAL-(Date.now()-(w.lastColossusAt||0)));return reply('🌌 Next random anomaly: '+(w.lastColossusAt?Math.ceil(wait/3600000)+' hours':'Awaiting first world cycle')+'.')}
 if(action!=='spawn')return reply('Use '+prefix+'colossus list | status | spawn [name].');
 if(!group)return reply('Anomalies must spawn inside a group.');
 const r=await updateDatabase(db=>{if(roleRank(roleOf(db,phone))<2)return {error:'Only owners and the creator can summon a Colossus.'};const w=world(db);if(w.spawns[group]||w.battles[group])return {error:'This group already has a spawn or battle.'};const requested=args.slice(1).join(' ').toLowerCase();const idx=COLOSSI.findIndex(b=>b.name.toLowerCase().includes(requested)||b.id===requested);if(requested&&idx<0)return {error:'Unknown Colossus. Use '+prefix+'colossus list.'};const beast=createColossus(requested?idx:undefined);if(!createSpawn(db,group,beast,sender,false))return {error:'Group busy.'};return {beast}});return reply(r.error||'🌌 *COLOSSAL ANOMALY*\n'+r.beast.species+'\nHP '+r.beast.hp+' | Attack '+r.beast.attack+' | Defense '+r.beast.defense+' | Speed '+r.beast.speed+'\nDefeat it to claim it. '+prefix+'catch to initiate battle.');
}};