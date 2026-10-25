// Curated species names from HTTYD franchise category and class pages.
// Some later-series class placements are provisional gameplay classifications.
// Colossal dragons are deliberately excluded pending creator rules.
export const FRANCHISE_SOURCE='https://howtotrainyourdragon.fandom.com/wiki/Category:Dragon_Species_from_the_Franchise';
const raw={
  "strike": "Night Fury|Light Fury|Skrill|Triple Stryke|Snow Wraith|Sand Wraith|Woolly Howl|Shockjaw|Deathgripper|Swiftwing|Threadtail|Windwalker|Silver Phantom|Stinger",
  "stoker": "Monstrous Nightmare|Singetail|Typhoomerang|Fireworm|Firefang|Flame Whipper|Gobsucker|Hobblegrunt|Hobgobbler|Night Terror|Terrible Terror|Fire Fury|Bubblehorn|Flame Thrower|Magma Breather|Sky Torcher|Snowtail|Fireworm Princess",
  "boulder": "Gronckle|Catastrophic Quaken|Eruptodon|Cavern Crasher|Groncicle|Hotburple|Snafflefang|Shovelhelm|Whispering Death|Screaming Death|Sentinel|Rockspitter|Slobber Smelter|Gembreaker|Gem Blaster|Glass Caster",
  "mystery": "Hideous Zippleback|Changewing|Death Song|Armorwing|Dramillion|Flightmare|Smothering Smokebreath|Snaptrapper|Buffalord|Boneknapper|Lycanwing|Sweet Death|Slithersong|Slitherwing|Mimicore|Copyclaw|Songwing|Mist Twister|Foreverwing",
  "tidal": "Thunderdrum|Scauldron|Seashocker|Submaripper|Shellfire|Tide Glider|Wave Glider|Shocktail|Flood Fang|Fathomfin|Fastfin|Octofin|Bubblegill|Luminous Krayfin|Sea Gronckle|Sliquifier",
  "sharp": "Razorwhip|Timberjack|Speed Stinger|Grim Gnasher|Devilish Dervish|Egg Biter|Hackatoo|Raincutter|Scuttleclaw|Shivertooth|Stormcutter|Thornridge|Windstriker|Woodchipper|Piercing Shriekscale|Razortooth Metalmaw|Relentless Razorwing",
  "tracker": "Deadly Nadder|Rumblehorn|Mudraker|Snifflehunch|Snifflehide|Hobblegrunt|Prickleboggle|Windgnasher|Roaming Ramblefang|Thunderclaw|Crimson Goregutter|Chillblaster|Featherhide|Puffertail|Silkspanner|Slinkwing"
};
const rarity=(name)=>/Night Fury|Light Fury|Skrill|Stormcutter|Deathgripper|Screaming Death|Foreverwing|Shellfire|Submaripper|Triple Stryke/.test(name)?'Legendary':/Death Song|Flightmare|Bewilder|Snow Wraith|Dramillion|Sentinel|Eruptodon|Screaming|Lycanwing|Slitherwing/.test(name)?'Epic':'Uncommon';
export const FRANCHISE_DRAGONS=Object.freeze(Object.entries(raw).flatMap(([dragonClass,names])=>names.split('|').map(species=>Object.freeze({
 species,dragonClass,origin:'HTTYD',rarity:rarity(species),
 powerTier:rarity(species)==='Legendary'?5:rarity(species)==='Epic'?4:2,
 description:'A dragon species appearing in the How to Train Your Dragon franchise.',
 source:FRANCHISE_SOURCE
}))));
