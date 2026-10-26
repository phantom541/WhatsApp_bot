import {readDatabase,updateDatabase} from '../lib/database.js';
import {ACHIEVEMENTS,achievementProgress,claimAchievement} from '../lib/achievements.js';
export default {name:'achievements',description:'View and claim rider achievements',async execute({sender,args,reply,prefix}){
 const action=(args[0]||'').toLowerCase();
 if(action==='claim'){
  const id=(args[1]||'').toLowerCase();
  if(!id)return reply('Use '+prefix+'achievements claim first_victory');
  const r=await updateDatabase(db=>claimAchievement(db.players[sender],id));
  return reply(r.error||'🏆 Achievement claimed: *'+r.achievement.name+'*! +'+r.achievement.coins+' coins. Title unlocked: *'+r.achievement.title+'*.');
 }
 const p=(await readDatabase()).players[sender];
 if(!p)return reply('Register first with '+prefix+'register.');
 return reply('🏆 *RIDER ACHIEVEMENTS*\n━━━━━━━━━━━━━━━━\n'+ACHIEVEMENTS.map(a=>{
  const value=achievementProgress(p,a),claimed=p.achievementsClaimed?.includes(a.id);
  return (claimed?'✅':value>=a.target?'🎁':'🔒')+' *'+a.name+'* ('+a.id+')\n'+Math.min(value,a.target)+'/'+a.target+' '+a.metric+' | '+a.coins+' coins | '+a.title;
 }).join('\n')+'\n━━━━━━━━━━━━━━━━\nClaim with '+prefix+'achievements claim <id>');
}};