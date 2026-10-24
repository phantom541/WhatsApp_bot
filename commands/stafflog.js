import {readDatabase} from '../lib/database.js';
import {roleOf,roleRank} from '../lib/roles.js';
export default {name:'stafflog',description:'Recent moderation activity',async execute({phone,reply}){
 const db=await readDatabase();
 if(roleRank(roleOf(db,phone))<1)return reply('Bot staff only.');
 const rows=(db.auditLog||[]).slice(-10).reverse();
 return reply('Audit log\n'+(rows.map(x=>x.when.slice(0,16)+' '+x.action).join('\n')||'No actions.'));
}};
