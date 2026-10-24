import {updateDatabase} from '../lib/database.js';
import {prepareCapture,CAPTURE_TOOLS} from '../lib/capture.js';
export default {name:'prepare',requiresStarter:true,description:'Use a capture supply before catching',async execute({sender,reply,args,prefix}){
 const key=(args[0]||'').toLowerCase().replace(/[-_]/g,'');
 if(!CAPTURE_TOOLS[key])return reply('Capture tools: '+Object.keys(CAPTURE_TOOLS).join(', ')+'.\nUsage: '+prefix+'prepare strongnet');
 const result=await updateDatabase(db=>prepareCapture(db.players[sender],key));
 return reply(result.error||'🪤 Prepared '+key+'! Catch bonus: +'+result.bonus+' percentage points. Now use '+prefix+'catch dragon-name.');
}};