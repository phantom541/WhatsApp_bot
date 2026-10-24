import {updateDatabase} from '../lib/database.js';
import {replaceMove} from '../lib/moves.js';
export default {name:'replacemove',requiresStarter:true,description:'Permanently replace a move at milestone levels',async execute({sender,reply,args,prefix}){
 const n=Number(args[0]),slot=Number(args[1]),name=args.slice(2).join(' ');
 if(!name)return reply('Usage: '+prefix+'replacemove 1 2 Dragon Breath');
 const result=await updateDatabase(db=>{
 const d=db.players[sender].dragons[n-1];
 if(!d)return 'Dragon not found.';
 const error=replaceMove(d,slot,name);
 return error||'Move replaced permanently. The old move cannot be learned again.';
 });
 return reply(result);
}};
