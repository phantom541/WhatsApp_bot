// Original procedural species, distinct from franchise species in DRAGON_CLASSES.
// 72 original species per class x 7 classes = 504 originals.
const roots={
 strike:['Volt','Storm','Flash','Bolt','Thunder','Static','Tempest','Spark','Surge','Sky','Arc','Cyclone'],
 stoker:['Ember','Cinder','Flare','Pyre','Ash','Blaze','Inferno','Scorch','Magma','Furnace','Kindle','Solar'],
 boulder:['Granite','Basalt','Obsidian','Pebble','Crag','Stone','Quake','Iron','Fossil','Rubble','Slate','Cobalt'],
 mystery:['Veil','Phantom','Mirage','Gloom','Specter','Rune','Dusk','Eclipse','Shroud','Whisper','Hex','Hollow'],
 tidal:['Coral','Brine','Tide','Abyss','Reef','Current','Riptide','Pearl','Kelp','Wave','Trench','Foam'],
 sharp:['Razor','Blade','Thorn','Spine','Scythe','Talon','Needle','Shard','Quill','Spike','Fang','Saber'],
 tracker:['Scent','Trail','Moss','Briar','Prowl','Sniff','Hound','Track','Fern','Claw','Howl','Pine']
};
const endings=['wing','maw','claw','scale','crest','tail'];
const tierFor=index=>index>=66?'Legendary':index>=54?'Epic':index>=36?'Rare':index>=18?'Uncommon':'Common';
export const ORIGINAL_DRAGONS=Object.freeze(Object.entries(roots).flatMap(([dragonClass,names])=>
 names.flatMap((root,i)=>endings.map((ending,j)=>{
  const index=i*6+j;
  return Object.freeze({
   species:root+ending,
   dragonClass,
   origin:'original',
   rarity:tierFor(index),
   powerTier:1+Math.floor(index/15),
   description:'An original '+dragonClass+'-class dragon known for '+root.toLowerCase()+'-inspired combat techniques.'
  });
 }))
));
export const ORIGINAL_BY_NAME=new Map(ORIGINAL_DRAGONS.map(d=>[d.species.toLowerCase(),d]));
export const ORIGINAL_COUNT=ORIGINAL_DRAGONS.length;
