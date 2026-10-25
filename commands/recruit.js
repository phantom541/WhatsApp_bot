import {updateDatabase} from '../lib/database.js';
import {addDragon} from '../lib/collection.js';
import {createCapturedDragon} from '../lib/dragon-factory.js';
export default {name:'recruit',requiresStarter:true,description:'Send a defeated wild dragon to party or den',async execute({sender,reply,args}){
 const choice=(args[0]||'auto').toLowerCase();
 if(!['auto','party','den'].includes(choice))return reply('Use _recruit party or _recruit den.');
 const r=await updateDatabase(db=>{
  const p=db.players[sender],e=p.pendingRecruit;
  if(!e)return {error:'No defeated dragon awaiting recruitment.'};
  const d=createCapturedDragon(e);
  if(!d)return {error:'Unknown dragon species.'};
  const location=addDragon(p,d,choice);
  p.pendingRecruit=null;
  return {species:d.species,location};
 });
 return reply(r.error||'🐉 '+r.species+' joined your '+r.location+'!');
}};
