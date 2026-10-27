export const SPECIES_LORE = Object.freeze({
  'Skrill': {habitat:'Stormy skies and cold regions',combat:'Lightning',trait:'Stores electrical energy'},
  'Thunderdrum': {habitat:'Oceans and coastal caves',combat:'Sonic blast',trait:'Strong underwater swimmer'},
  'Changewing': {habitat:'Forests',combat:'Acid',trait:'Camouflage'},
  'Death Song': {habitat:'Forests',combat:'Amber trap',trait:'Luring song'},
  'Gronckle': {habitat:'Rocky areas',combat:'Lava blasts',trait:'Eats rocks'},
  'Hideous Zippleback': {habitat:'Forests',combat:'Gas and ignition',trait:'Two heads cooperate'},
  'Deadly Nadder': {habitat:'Forests and open terrain',combat:'Fire and tail spines',trait:'Precise tracking'},
  'Monstrous Nightmare': {habitat:'Rocky regions',combat:'Fire',trait:'Can ignite its body'},
  'Razorwhip': {habitat:'Coastal and rocky areas',combat:'Sharp tail',trait:'Metallic scales'}
});
export function speciesLore(name) { return SPECIES_LORE[String(name || '').trim()] || null; }
