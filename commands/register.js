import {updateDatabase} from '../lib/database.js';
import {displayName,playerTag} from '../lib/identity.js';
export default {name:'register',description:'Register WhatsApp player profile',async execute({sender,phone,message,reply}){
 const name=displayName(message);
 const result=await updateDatabase(db=>{
  const p=db.players[sender];
  if(p){p.whatsappName=name;if(phone)p.phoneNumber=phone;p.playerId=playerTag(name,p.phoneNumber);return {created:false,id:p.playerId};}
  db.players[sender]={coins:100,level:1,xp:0,dragons:[],inventory:[],whatsappName:name,phoneNumber:phone||null,playerId:playerTag(name,phone),createdAt:new Date().toISOString()};
  return {created:true,id:db.players[sender].playerId};
 });
 return reply(result.created?'🐉 Registered! 100 coins. Player ID: '+result.id:'Already registered. Player ID: '+result.id);
}};
