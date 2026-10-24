export function recordQuest(p,key){
 const today=new Date().toISOString().slice(0,10);
 if(!p.quests||p.quests.date!==today)p.quests={date:today,hunt:0,catch:0,win:0,claimed:[]};
 p.quests[key]=(p.quests[key]||0)+1;
}
