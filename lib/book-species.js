// Book-continuity species adapted to the bot's seven gameplay classes.
// These gameplay class assignments are not the book's original taxonomy.
// Names drawn from the HTTYD Wiki book species category; exclude character names.
export const BOOK_SOURCE='https://howtotrainyourdragon.fandom.com/wiki/Category:Dragon_Species_from_the_Books';
const groups={
  "strike": "Arsenic Adderwing|Deadly Shadow|Deadly Nightshade|Thunderdeath Darkwing|Thor's Thunderer|Hurricane|Razorwing|Rocket Ripper|Rocket-Rage|Sky Dragon|Swiftglider|Storm Dragon|Lightwing|Flashfang|Vultureclaw|Eaglefly|Windwalker",
  "stoker": "Breathquencher|Darkbreather|Firestarter|Flamehuffer|Gorebreather|Goreblaster|Goredragon|Gory-Gummed Gronckle|Red-Hot Itchyworm|Rageblast|Fire Dragon|Woden's Nightmare|Monstrous Strangulator|Hellsteether|Snub-Nosed Hellsteether|Doomfang|Throatgoggler|Tigerbreath",
  "boulder": "Big Spotted Gormless|Bullingdozer|Bullpuff|Bullrougher|Brainless Leg-Remover|Driller-Dragon|Eight-Legged Battlegore|Eight-Legged Nadder|Giant Deathwatch|Gorgenghast|Riproarer|Rhinoback|Skullion|Slugbulb|Trotterdragon|Emperor Beetleboog Bolderbug",
  "mystery": "Basic Brown|Brainpicker|Caterbillar|Cuckoo Dragon|Death's Head Badluck Grimfate|Dreamserpent|Drowsy-Tipped Dragonmouse|Electricsticky|Glow-worm|Hypnomunk|Mood-Dragon|Mocker|Pricklepine|Poisonous Piffleworm|Prophecy Dragon|Sticky Stealer|Stickyworm|Vampire Dragon|Vampire Ghouldeath|Vampire Spydragon|Yellow Vampire|Common or Garden Dragon|Toothless Daydream|Leviathorgan",
  "tidal": "Bloody Crocoraptor|Blubberwing|Burrowing Slitherfang|Centidile|Golphin|Lesser Blackbacked Seadragon|Ocean Dragon-Mammoth|Octodangle|Piranha Hermit Dragon|Polar-Serpent|Sandshark|Seadragonus Giganticus Maximus|Sharkworm|Slitherfang|Water Dragon|Winterflesher|Sand Rattler|Sandrazor|Venomous Vorpent|Plankenteenie|Slobbering",
  "sharp": "Deepest Purple Fleshfang|Devilish Dervish|Gloomer|Grimwing|Monstrous Strangulator|Poison Darter|Raptortongue|Rawripper|Rottviper|Sabre-Tooth Driver Dragon|Slitherhawk|Sidewinder|Snare Dragon|Toxic Nightshade|Wolf-Fang|Greater Pricklepine|Exterminator",
  "tracker": "Brainless Leg-Remover|Carrier Dragon|Chickenpoxer|Doldrum|Fernwinder|Flutterfire|Giant Bee-Eater|Hogfly|Lackwit|Loafer Dragon|Long-Eared Caretaker Dragon|Long-Eared Flutterfire|Marsh Tiger|Puggle|Ravenhunter|Red Tiger|Screech Dragon|Sniffer Dragon|Specklehound|Squealer|Tigerbreath|Zebramount|Puff Nadder|Sand Rattler|White Dragon"
};
export const BOOK_DRAGONS=Object.freeze(Object.entries(groups).flatMap(([dragonClass,names])=>names.split('|').map(species=>Object.freeze({species,dragonClass,origin:'HTTYD Books',rarity:'Uncommon',powerTier:2,description:'A dragon species from the Cressida Cowell book continuity.',source:BOOK_SOURCE}))));
