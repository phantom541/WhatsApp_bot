import {readFile} from 'node:fs/promises';
import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
import {join,dirname} from 'node:path';
import {readDatabase,updateDatabase} from '../lib/database.js';
import {DUNGEONS,dungeonKey,dungeonCaption} from '../lib/dungeons.js';
import {BESTIARY,BOSS_MOVES,dungeonEnemy} from '../lib/dungeon-combat.js';
import {MONSTER_MOVES} from '../lib/dungeon-monster-moves.js';
import {groupId,world,beginBattle,endBattle} from '../lib/world-events.js';
const root=join(dirname(fileURLToPath(import.meta.url)),'..','assets');
const assets=join(root,'dungeons');
const bossImages=join(root,'dungeon_bosses');
const monsterImages=join(root,'dungeon_monsters');
const BOSS_FILES=Object.freeze({blue:'glacior.png',orange:'ignarok.png',red:'varkhaz.png',purple:'nyxara.png',black:'morvath.png','purple-black':'xalthor.png'});
const xml=value=>String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
async function makeMonsterCard(enemy,floor,prefix){
 const moves=enemy.boss?BOSS_MOVES[enemy.dungeonKey]:MONSTER_MOVES[enemy.species];
 const lines=(moves||[]).map((move,i)=>'<text x="64" y="'+(500+i*58)+'" font-size="27" fill="#e8eaf6">'+(i+1)+'. '+xml(move[0])+'</text><text x="1090" y="'+(500+i*58)+'" text-anchor="end" font-size="25" fill="#b9c4df">'+move[1]+' POW  •  '+move[2]+'% ACC</text>').join('');
 const svg='<svg width="1200" height="900" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#11172c"/><stop offset="1" stop-color="#39204f"/></linearGradient></defs><rect width="1200" height="900" rx="36" fill="url(#g)"/><rect x="28" y="28" width="1144" height="844" rx="28" fill="none" stroke="#9b8acb" stroke-width="3"/><text x="64" y="92" font-size="28" fill="#b9a7ef" letter-spacing="5">DUNGEON ENCOUNTER • FLOOR '+floor+'/10</text><text x="64" y="166" font-size="52" font-weight="bold" fill="#fff">'+xml(enemy.species)+(enemy.boss?'  •  BOSS':'')+'</text><text x="64" y="224" font-size="28" fill="#c9d2e8">LEVEL '+enemy.level+'</text><text x="64" y="304" font-size="30" fill="#fff">HP  '+enemy.hp+'     ATK  '+enemy.attack+'     DEF  '+enemy.defense+'     SPD  '+enemy.speed+'</text><path d="M64 350 H1136" stroke="#8273ad" stroke-width="2"/><text x="64" y="420" font-size="30" font-weight="bold" fill="#c9b8ff">MOVES</text>'+lines+'<text x="64" y="830" font-size="22" fill="#aab3cc">Use '+xml(prefix)+'battlefight 1-'+(moves?.length||4)+' to attack</text></svg>';
 return sharp(Buffer.from(svg)).png().toBuffer();
}
export default {name:'dungeon',requiresStarter:true,description:'Explore ten-floor dungeons',async execute({sender,reply,args,prefix,sock,message}){
 const action=(args[0]||'').toLowerCase(),group=groupId(message.key.remoteJid);
 if(action==='leave'||action==='exit'){const result=await updateDatabase(db=>{const p=db.players[sender];if(!p.activeDungeon)return 'You are not inside a dungeon.';const name=DUNGEONS[p.activeDungeon].name,floor=p.dungeonFloor||1;const reward=floor>=6?floor*200:0;p.coins=(p.coins||0)+reward;p.activeDungeon=null;p.dungeonFloor=0;p.dungeonBattle=null;if(group&&world(db).battles[group]?.player===sender)endBattle(db,group);return '🚪 Left '+name+'. '+(reward?'Partial reward: '+reward+' coins.':'No partial reward before clearing floor 5.')});return reply(result)}
 if(action==='enter'){const key=dungeonKey(args.slice(1).join(' '));if(!key)return reply('Choose a gate: '+Object.keys(DUNGEONS).join(', '));const result=await updateDatabase(db=>{const p=db.players[sender];if(p.activeEncounter||p.pendingRecruit)return 'Finish your wild encounter first.';if(group&&(world(db).spawns[group]||world(db).battles[group]))return 'A spawn or battle is active in this group.';if(p.activeDungeon)return 'Already inside '+DUNGEONS[p.activeDungeon].name+'.';p.activeDungeon=key;p.dungeonFloor=1;p.dungeonBattle=null;p.dungeonEnteredAt=Date.now();return null});if(result)return reply(result);return reply('🚪 *Entered '+DUNGEONS[key].name+'*\n🔮 _'+DUNGEONS[key].scry+'_\n\nFloor 1 of 10. Use '+prefix+'dungeon next to encounter a monster.')}
 if(action==='next'||action==='fight'){
  const r=await updateDatabase(db=>{
   const p=db.players[sender];
   if(!p.activeDungeon)return {error:'Enter a dungeon first.'};
   if(p.dungeonBattle)return {existing:true,enemy:p.dungeonBattle.enemy,floor:p.dungeonFloor};
   if(group&&world(db).spawns[group])return {error:'A wild dragon is already spawned in this group.'};
   if(group&&world(db).battles[group]&&world(db).battles[group].player!==sender)return {error:'Another battle is active in this group.'};
   if(group&&!beginBattle(db,group,sender,'dungeon'))return {error:'This group is busy.'};
   const enemy=dungeonEnemy(p.activeDungeon,p.dungeonFloor||1);
   p.dungeonBattle={enemy,cardSent:true};
   return {enemy,floor:p.dungeonFloor};
  });
  if(r.error)return reply(r.error);
  if(r.existing)return reply('⚔️ Battle already active against *'+r.enemy.species+'*. The encounter images were already shown. Use '+prefix+'battlefight 1-4 or '+prefix+'dungeon status.');
  const caption='⚔️ Floor '+r.floor+'/10: *'+r.enemy.species+'*'+(r.enemy.boss?' 👑 BOSS':'')+'\\nHP '+r.enemy.hp+' | Level '+r.enemy.level+'\\nUse '+prefix+'battlefight 1-4.';
  const key=r.enemy.dungeonKey||(await readDatabase()).players[sender]?.activeDungeon;
  const file=r.enemy.boss?BOSS_FILES[key]:r.enemy.species.toLowerCase().replace(/[^a-z0-9]+/g,'_')+'.png';
  const folder=r.enemy.boss?bossImages:join(monsterImages,key||'');
  try{
   const image=await readFile(join(folder,file));
   await sock.sendMessage(message.key.remoteJid,{image,caption},{quoted:message});
  }catch(error){
   if(error.code!=='ENOENT')throw error;
   await reply(caption+'\\n(Monster artwork is not installed yet.)');
  }
  const card=await makeMonsterCard(r.enemy,r.floor,prefix);
  return sock.sendMessage(message.key.remoteJid,{image:card,caption:'📊 *'+r.enemy.species+' | STATS & MOVE CARD*'},{quoted:message});
 }if(action==='status'){const p=(await readDatabase()).players[sender];return reply(p.activeDungeon?'🌀 '+DUNGEONS[p.activeDungeon].name+' | Floor '+(p.dungeonFloor||1)+'/10\n'+(p.dungeonBattle?'Enemy: '+p.dungeonBattle.enemy.species+' HP '+p.dungeonBattle.enemy.hp:'Use '+prefix+'dungeon next'):'Not inside a dungeon.')}
 if(action==='monsters'){const key=dungeonKey(args.slice(1).join(' '));if(!key)return reply('Use '+prefix+'dungeon monsters blue');const b=BESTIARY[key];return reply('📖 '+DUNGEONS[key].name+'\nMonsters: '+b.mobs.join(', ')+'\nFloor 10 boss: '+b.boss)}
 const key=dungeonKey(args.join(' '));if(!key)return reply('Use '+prefix+'dungeons, '+prefix+'dungeon enter blue, or '+prefix+'dungeon status.');
 const caption=dungeonCaption(key,prefix);try{const image=await readFile(join(assets,DUNGEONS[key].image));return sock.sendMessage(message.key.remoteJid,{image,caption},{quoted:message})}catch(error){if(error.code!=='ENOENT')throw error;return reply(caption+'\n(Gate image missing on server.)')}
}};