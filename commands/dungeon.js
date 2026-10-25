import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join,dirname} from 'node:path';
import {readDatabase,updateDatabase} from '../lib/database.js';
import {DUNGEONS,dungeonKey,dungeonCaption} from '../lib/dungeons.js';
const assets=join(dirname(fileURLToPath(import.meta.url)),'..','assets','dungeons');
export default {name:'dungeon',requiresStarter:true,description:'View, enter or leave a dungeon',async execute({sender,reply,args,prefix,sock,message}){
 const action=(args[0]||'').toLowerCase();
 if(action==='leave'||action==='exit'){
  const result=await updateDatabase(db=>{
   const p=db.players[sender];
   if(!p.activeDungeon)return 'You are not inside a dungeon.';
   const name=DUNGEONS[p.activeDungeon]?.name||'the dungeon';
   p.activeDungeon=null;p.dungeonEnteredAt=null;
   return '🚪 You leave '+name+'.';
  });
  return reply(result);
 }
 if(action==='enter'){
  const key=dungeonKey(args.slice(1).join(' '));
  if(!key)return reply('Choose a gate: '+Object.keys(DUNGEONS).join(', '));
  const result=await updateDatabase(db=>{
   const p=db.players[sender];
   if(p.activeEncounter||p.pendingRecruit)return 'Finish your wild encounter first.';
   if(p.activeDungeon)return 'Already inside '+DUNGEONS[p.activeDungeon].name+'. Use '+prefix+'dungeon leave.';
   p.activeDungeon=key;p.dungeonEnteredAt=Date.now();
   return null;
  });
  if(result)return reply(result);
  return reply('🚪 *Entered '+DUNGEONS[key].name+'*\nThe vortex seals behind you.\n\n🔮 _'+DUNGEONS[key].scry+'_\n\nDungeon combat is not available yet.\nExit: '+prefix+'dungeon leave');
 }
 const key=dungeonKey(args.join(' '));
 if(!key)return reply('See '+prefix+'dungeons or inspect with '+prefix+'dungeon blue.');
 const player=(await readDatabase()).players[sender];
 if(player.activeDungeon)return reply('Leave your current dungeon first: '+prefix+'dungeon leave');
 const caption=dungeonCaption(key,prefix);
 try{
  const image=await readFile(join(assets,DUNGEONS[key].image));
  return sock.sendMessage(message.key.remoteJid,{image,caption},{quoted:message});
 }catch(error){
  if(error.code!=='ENOENT')throw error;
  return reply(caption+'\n\n(Gate image not installed on the bot server yet.)');
 }
}};