import {readDatabase} from '../lib/database.js';
import {roleOf} from '../lib/roles.js';
export default {name:'profile',description:'View player identity and stats',async execute({sender,phone,reply,prefix}){
 const db=await readDatabase(),p=db.players[sender];
 if(!p)return reply('Register first with '+prefix+'register');
 return reply('🐉 *Rider Profile*\nName: '+(p.whatsappName||'Dragon Rider')+'\nPlayer ID: '+(p.playerId||'Not assigned; use '+prefix+'register')+'\nPhone: '+(p.phoneNumber?'••••'+p.phoneNumber.slice(-4):'Unavailable')+'\nRole: '+roleOf(db,phone)+'\nLevel: '+p.level+' | XP: '+p.xp+'\nCoins: '+p.coins+' | Dragons: '+p.dragons.length);
}};
