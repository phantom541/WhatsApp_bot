import {updateDatabase} from '../lib/database.js';
import {REGIONS} from '../lib/regions.js';
export default {name:'travel',requiresStarter:true,description:'Travel to a hunting region',async execute({sender,reply,args,prefix}){
 const key=(args[0]||'').toLowerCase();
 if(!REGIONS[key])return reply('Unknown region. View '+prefix+'regions.');
 const result=await updateDatabase(db=>{const p=db.players[sender];if(p.activeEncounter||p.pendingRecruit)return 'Finish your encounter or recruit first.';p.region=key;return '🗺️ Arrived at '+REGIONS[key].name+'. Hunt with '+prefix+'hunt.';});
 return reply(result);
}};
