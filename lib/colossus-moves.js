// Twelve distinct, selectable techniques for each of the six implemented Colossi.
// Move power and accuracy are deliberately varied. The seventh beast is reserved.
const NAMES={
  "lycagon": [
    "Moonshadow Rend",
    "Nightslayer Fang",
    "Umbral Pursuit",
    "Black Moon Howl",
    "Phantom Pounce",
    "Eclipse Talon",
    "Midnight Ambush",
    "Shadowfang Barrage",
    "Lunar Execution",
    "Nightmare Hunt",
    "Darkness Dominion",
    "Full Moon Cataclysm"
  ],
  "wethermon": [
    "Tombguard Slash",
    "Gravekeeper Stance",
    "Samurai's Verdict",
    "Ancient Blade",
    "Phantom Katana",
    "Burial Tempest",
    "Fallen Warrior",
    "Cemetery Crescent",
    "Steel Requiem",
    "Last Oath",
    "Tomb Seal",
    "Zero Hour Severance"
  ],
  "ctarnidd": [
    "Abyssal Current",
    "Drowned Grasp",
    "Deepsea Crush",
    "Tidal Labyrinth",
    "Pressure Collapse",
    "Voidwater Lance",
    "Leviathan Coil",
    "Trench Maelstrom",
    "Abyssal Mirage",
    "Ocean's Judgement",
    "Sunken Dominion",
    "Bottomless Deluge"
  ],
  "siegwurm": [
    "Skyfire Lance",
    "Thunderwing",
    "Stormscale Dive",
    "Lightning Talon",
    "Heavenly Roar",
    "Tempest Spear",
    "Skybreaker",
    "Cyclone Ascension",
    "Thunder Crown",
    "Celestial Crash",
    "Raging Firmament",
    "Sovereign's Judgement"
  ],
  "goldhuneenay": [
    "Endless Hunger",
    "Golden Rampart",
    "Buried Avalanche",
    "Inexhaustible Crush",
    "Earthen Maw",
    "Gilded Quake",
    "Stoneheart",
    "Mountain's Wrath",
    "Relentless Siege",
    "Goldstorm",
    "Unending Cataclysm",
    "World-Eater"
  ],
  "orchestra": [
    "Doom Overture",
    "Echoing Dirge",
    "Discordant Pulse",
    "Spectral Chorus",
    "Phantom Crescendo",
    "Requiem Note",
    "Haunting Resonance",
    "Dissonance Storm",
    "Silent Interval",
    "Deathless Symphony",
    "Final Movement",
    "Apocalypse Encore"
  ]
};
const TYPES={lycagon:'shadow',wethermon:'metal',ctarnidd:'tide',siegwurm:'storm',goldhuneenay:'stone',orchestra:'shadow'};
const POWERS=[34,45,52,58,67,74,83,91,102,114,130,155];
const ACCURACIES=[100,95,95,90,90,85,85,80,80,75,70,65];
export const COLOSSUS_MOVES=Object.freeze(Object.fromEntries(Object.entries(NAMES).map(([id,names])=>[id,Object.freeze(names.map((name,i)=>Object.freeze({name,power:POWERS[i],accuracy:ACCURACIES[i],type:TYPES[id]})))])));
export function colossusMoves(dragon){const id=dragon?.colossusId||dragon?.id;return COLOSSUS_MOVES[id]||null;}
