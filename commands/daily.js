import {updateDatabase} from '../lib/database.js';
import {roleOf} from '../lib/roles.js';
export default {name:'daily',requiresStarter:true,description:'Claim daily coins',async execute({sender,phone,reply}){
 const r=await updateDatabase(db=>{
 const p=db.players[sender],today=new Date().toISOString().slice(0,10);
 if(p.lastDaily===today)return {error:'Already claimed today.'};
 const coins={player:50,mod:65,owner:80,creator:100}[roleOf(db,phone)];
 p.coins=(p.coins||0)+coins;p.lastDaily=today;return {coins};
 });
 return reply(r.error||'🎁 Daily coins: +'+r.coins);
}};
