import {readDatabase,updateDatabase} from '../lib/database.js';
import {unlockedTitles,activeTitle,selectTitle} from '../lib/achievements.js';
import {riderRank} from '../lib/rider-progression.js';
export default {name:'titles',description:'View and equip earned rider titles',async execute({sender,args,reply,prefix}){
 if((args[0]||'').toLowerCase()==='equip'){
  const title=args.slice(1).join(' ');
  if(!title)return reply('Use '+prefix+'titles equip Newborn Flame');
  const r=await updateDatabase(db=>selectTitle(db.players[sender],title));
  return reply(r.error||'🏷️ Equipped title: *'+r.title+'*');
 }
 const p=(await readDatabase()).players[sender];
 if(!p)return reply('Register first with '+prefix+'register.');
 return reply('🏷️ *RIDER TITLES*\nRank: '+riderRank(p)+'\nEquipped: *'+activeTitle(p)+'*\nUnlocked:\n'+unlockedTitles(p).map(t=>'• '+t).join('\n')+'\nEquip: '+prefix+'titles equip <title>');
}};