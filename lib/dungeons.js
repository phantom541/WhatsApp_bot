// Six portal gates. The image files live in assets/dungeons/ after deployment.
export const DUNGEONS=Object.freeze({
 blue:{name:'Blue Dungeon',color:'blue',image:'blue.png',description:'The depths hold what you seek... if you survive.',scry:'The water is still. Something beneath it is not.'},
 orange:{name:'Orange Dungeon',color:'orange',image:'orange.png',description:'Heat, danger, and treasure await the brave.',scry:'The embers whisper of riches. They never mention the price.'},
 red:{name:'Red Dungeon',color:'red',image:'red.png',description:'Only the strong survive the crimson depths.',scry:'A heartbeat echoes from the other side. It is not yours.'},
 purple:{name:'Purple Dungeon',color:'purple',image:'purple.png',description:'Not everything is as it seems...',scry:'Your reflection enters the gate a moment before you do.'},
 black:{name:'Black Dungeon',color:'black',image:'black.png',description:'Face your fears. Find your strength.',scry:'No light escapes this doorway. Yet something inside sees you.'},
 'purple-black':{name:'Purple-Black Dungeon',color:'purple-black',image:'purple-black.png',description:'Where light and dark collide, only the worthy enter.',scry:'Two shadows wait beyond the threshold. Only one follows your steps.'}
});
export function dungeonKey(value){
 const key=String(value||'').trim().toLowerCase().replace(/[\s_]+/g,'-');
 return Object.hasOwn(DUNGEONS,key)?key:null;
}
export function dungeonCaption(key,prefix='_'){
 const d=DUNGEONS[key];
 if(!d)return null;
 return '🌀 *'+d.name+' Gate*\n'+d.description+'\n\n🔮 *Scrying:* _'+d.scry+'_\n\n🚪 Enter: *'+prefix+'dungeon enter '+key+'*\n🔍 Inspect another gate: *'+prefix+'dungeon '+key+'*\n📜 All gates: *'+prefix+'dungeons*';
}
