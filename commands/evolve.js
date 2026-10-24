import {updateDatabase} from '../lib/database.js';
import {evolveDragon} from '../lib/ascension.js';
export default {name:'evolve',requiresStarter:true,description:'Ascend dragons with matching evolution stones',async execute({sender,reply,args,prefix}){
 const slot=Number(args[0]),key=(args[1]||'').toLowerCase().replace(/[-_]/g,'');
 if(!Number.isInteger(slot)||slot<1||!key)return reply('Usage: '+prefix+'evolve 1 strikestone');
 const r=await updateDatabase(db=>evolveDragon(db.players[sender],slot,key));
 return reply(r.error||'✨ '+r.message);
}};
