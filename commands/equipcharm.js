import {updateDatabase} from '../lib/database.js';
import {CHARMS} from '../lib/catalog.js';
import {inventoryCount} from '../lib/items.js';
export default {name:'equipcharm',requiresStarter:true,description:'Equip purchased charms on dragons',async execute({sender,reply,args,prefix}){
 const n=Number(args[0]),key=(args[1]||'').toLowerCase();
 if(!Number.isInteger(n)||n<1||!(key in CHARMS)&&key!=='none')return reply('Usage: '+prefix+'equipcharm 1 powercharm (or none)');
 const result=await updateDatabase(db=>{
  const p=db.players[sender],d=p.dragons[n-1];
  if(!d)return 'Dragon not found.';
  if(key==='none'){d.equippedCharm=null;return 'Charm unequipped from '+d.species+'.';}
  const owned=inventoryCount(p,key);
  const used=p.dragons.filter(x=>x.id!==d.id&&x.equippedCharm===key).length;
  if(owned<=used)return 'You need an unused '+CHARMS[key].name+' in your bag. Owned: '+owned+', equipped to other dragons: '+used+'.';
  d.equippedCharm=key;
  return '✨ '+d.species+' equipped '+CHARMS[key].name+'.';
 });
 return reply(result);
}};
