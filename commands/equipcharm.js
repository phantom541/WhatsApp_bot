import {updateDatabase} from '../lib/database.js';
import {CHARMS} from '../lib/catalog.js';
import {inventoryCount} from '../lib/items.js';
export default {name:'equipcharm',requiresStarter:true,description:'Equip a performance charm on a dragon',async execute({sender,reply,args,prefix}){
 const n=Number(args[0]),key=(args[1]||'').toLowerCase();
 if(!Number.isInteger(n)||n<1||!CHARMS[key])return reply('Usage: '+prefix+'equipcharm 1 powercharm');
 const r=await updateDatabase(db=>{
 const p=db.players[sender],d=p.dragons[n-1];
 if(!d)return 'Dragon not found.';
 if(!inventoryCount(p,key))return 'You do not own that charm.';
 d.equippedCharm=key;
 return '✨ '+d.species+' equipped '+CHARMS[key].name+'.';
 });
 return reply(r);
}};
