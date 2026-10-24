import {updateDatabase} from '../lib/database.js';
export default {name:'claimquest',requiresStarter:true,description:'Claim completed daily quest rewards',async execute({sender,reply,args,prefix}){
 const id=(args[0]||'').toLowerCase(),tasks={hunt:[3,70],catch:[1,90],win:[2,110]};
 if(!tasks[id])return reply('Usage: '+prefix+'claimquest hunt|catch|win');
 const r=await updateDatabase(db=>{
 const p=db.players[sender],q=p.quests,date=new Date().toISOString().slice(0,10);
 if(!q||q.date!==date)return {error:'No progress today.'};
 if((q[id]||0)<tasks[id][0])return {error:'Quest not yet completed.'};
 if(q.claimed?.includes(id))return {error:'Reward already claimed.'};
 q.claimed??=[];q.claimed.push(id);p.coins=(p.coins||0)+tasks[id][1];return {coins:tasks[id][1]};
 });
 return reply(r.error||'🏆 Quest reward: +'+r.coins+' coins!');
}};
