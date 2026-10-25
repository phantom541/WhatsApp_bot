import {updateDatabase} from '../lib/database.js';
import {displayName,playerTag} from '../lib/identity.js';
import {roleOf} from '../lib/roles.js';
import {dragonSpeciesInfo,DRAGON_CLASSES} from '../lib/dragons.js';
import {addDragon} from '../lib/collection.js';
import {randomUUID} from 'node:crypto';
import {combatStats} from '../lib/dragon-combat-profile.js';
function linkCreatorDragon(db,p,phone){
 if(roleOf(db,phone)!=='creator')return;
 if(p.dragons?.some(d=>d.creatorBound&&d.species==='Red Fury'))return;
 const info=dragonSpeciesInfo('Red Fury'),cls=DRAGON_CLASSES.strike;
 const stats=combatStats('Red Fury','strike',1,5);
 addDragon(p,{id:randomUUID(),species:info.species,dragonClass:cls.label,element:cls.label,emoji:'🔴',level:1,xp:0,hp:stats.maxHp,maxHp:stats.maxHp,attack:stats.attack,defense:stats.defense,speed:stats.speed,role:'apex',combatType:'storm',ability:'Crimson Stormfire',rarity:info.rarity,powerTier:5,origin:info.origin,creatorBound:true,tradable:false,isStarter:false,acquiredAt:new Date().toISOString()},'den');
}

export default {name:'register',description:'Register WhatsApp player profile',async execute({sender,phone,message,reply}){
 const name=displayName(message);
 const result=await updateDatabase(db=>{
  const p=db.players[sender];
  if(p){p.whatsappName=name;if(phone)p.phoneNumber=phone;p.playerId=playerTag(name,p.phoneNumber);linkCreatorDragon(db,p,phone);return {created:false,id:p.playerId};}
  db.players[sender]={coins:100,level:1,xp:0,dragons:[],inventory:[],whatsappName:name,phoneNumber:phone||null,playerId:playerTag(name,phone),createdAt:new Date().toISOString()};
  linkCreatorDragon(db,db.players[sender],phone);
  return {created:true,id:db.players[sender].playerId};
 });
 return reply(result.created?'🐉 Registered! 100 coins. Player ID: '+result.id:'Already registered. Player ID: '+result.id);
}};
