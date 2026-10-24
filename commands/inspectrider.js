import {readDatabase} from '../lib/database.js';
import {roleOf,roleRank} from '../lib/roles.js';
import {targetPlayer} from '../lib/admin.js';
import {phoneDigits} from '../lib/identity.js';
export default {name:'inspectrider',description:'Bot moderator review game stats',async execute({phone,reply,args,prefix}){
 const target=phoneDigits(args[0]);if(target.length<8)return reply('Usage: '+prefix+'inspectrider NUMBER');
 const db=await readDatabase();if(roleRank(roleOf(db,phone))<1)return reply('Bot staff only.');
 const found=targetPlayer(db,target);if(!found)return reply('Player not found.');
 const p=found.player;
 return reply('🧭 Rider: '+(p.whatsappName||'Unknown')+'\nID: '+(p.playerId||'Unassigned')+'\nRole: '+roleOf(db,target)+'\nCoins: '+(p.coins||0)+'\nDragons: '+(p.dragons?.length||0)+'\nLevel: '+(p.level||1)+'\nBattle: '+(p.activeEncounter?'active':'none'));
}};
