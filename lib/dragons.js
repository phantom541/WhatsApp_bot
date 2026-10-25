import { FRANCHISE_DRAGONS } from './franchise-species.js';
import { BOOK_DRAGONS } from './book-species.js';
import { ORIGINAL_DRAGONS, ORIGINAL_BY_NAME } from './dragon-species.js';
import { randomUUID } from 'node:crypto';
export const DRAGON_CLASSES = Object.freeze({
  strike: { label: 'Strike', emoji: '⚡', specialty: 'Speed, accuracy, intelligence', species: ['Night Fury', 'Skrill', 'Triple Stryke', 'Snow Wraith'], starter: 'Skrill', hp: 105, attack: 19, defense: 8, speed: 19, ability: 'Lightning Strike' },
  stoker: { label: 'Stoker', emoji: '🔥', specialty: 'Firepower and sustained attacks', species: ['Monstrous Nightmare', 'Singetail', 'Typhoomerang', 'Fireworm Princess'], starter: 'Monstrous Nightmare', hp: 125, attack: 18, defense: 10, speed: 11, ability: 'Inferno Blast' },
  boulder: { label: 'Boulder', emoji: '🪨', specialty: 'Durability and rock-based attacks', species: ['Gronckle', 'Catastrophic Quaken', 'Eruptodon', 'Cavern Crasher'], starter: 'Gronckle', hp: 160, attack: 12, defense: 20, speed: 6, ability: 'Lava Burst' },
  mystery: { label: 'Mystery', emoji: '🕵️', specialty: 'Stealth and unusual abilities', species: ['Hideous Zippleback', 'Changewing', 'Death Song', 'Armorwing', 'Dramillion'], starter: 'Hideous Zippleback', hp: 120, attack: 14, defense: 11, speed: 13, ability: 'Smoke Veil' },
  tidal: { label: 'Tidal', emoji: '🌊', specialty: 'Aquatic defense and sonic attacks', species: ['Thunderdrum', 'Scauldron', 'Seashocker', 'Submaripper', 'Shellfire'], starter: 'Thunderdrum', hp: 145, attack: 14, defense: 16, speed: 9, ability: 'Sonic Roar' },
  sharp: { label: 'Sharp', emoji: '⚔️', specialty: 'Precision and piercing attacks', species: ['Razorwhip', 'Timberjack', 'Speed Stinger', 'Grim Gnasher'], starter: 'Razorwhip', hp: 115, attack: 18, defense: 11, speed: 16, ability: 'Razor Barrage' },
  tracker: { label: 'Tracker', emoji: '👃', specialty: 'Tracking and hunting', species: ['Deadly Nadder', 'Rumblehorn', 'Mudraker'], starter: 'Deadly Nadder', hp: 130, attack: 15, defense: 12, speed: 15, ability: 'Hunter Instinct' },
});
export const STARTERS = DRAGON_CLASSES;
export const RED_FURY = Object.freeze({species:'Red Fury',dragonClass:'strike',origin:'Creator Original',rarity:'Mythic',powerTier:5,description:'An exceptionally rare crimson dragon with devastating stormfire abilities.'});
export const ALL_DRAGON_SPECIES = Object.freeze([...new Map([...ORIGINAL_DRAGONS,...BOOK_DRAGONS,...Object.entries(DRAGON_CLASSES).flatMap(([dragonClass,d])=>d.species.map(species=>({species,dragonClass,origin:'HTTYD',rarity:'Uncommon',powerTier:2}))),...FRANCHISE_DRAGONS,RED_FURY].map(d=>[normalizeDragonName(d.species),d])).values()]);
export const dragonSpeciesInfo = name => ALL_DRAGON_SPECIES.find(d=>normalizeDragonName(d.species)===normalizeDragonName(name)) || null;
export function normalizeDragonName(name) {
  return String(name || '').trim().replace(/^--/, '').replace(/[\s_-]+/g, '').toLowerCase();
}
export function findStarterSpecies(name) {
  const normalized = normalizeDragonName(name);
  if (!normalized) return null;
  for (const [key, dragonClass] of Object.entries(DRAGON_CLASSES)) {
    const species = dragonClass.species.find(s => normalizeDragonName(s) === normalized);
    if (species) return { key, species, dragonClass };
  }
  return null;
}
export function createStarter(name) {
  const found = findStarterSpecies(name);
  if (!found) return null;
  const { species, dragonClass: d } = found;
  const metadata = dragonSpeciesInfo(species);
  return { id: randomUUID(), species, dragonClass: d.label, element: d.label, emoji: d.emoji, level: 1, xp: 0, hp: 24 + Math.floor(d.hp / 25), maxHp: 24 + Math.floor(d.hp / 25), attack: 3 + Math.floor(d.attack / 8), defense: 2 + Math.floor(d.defense / 8), speed: 3 + Math.floor(d.speed / 8), ability: d.ability, rarity: metadata?.rarity || 'Uncommon', powerTier: metadata?.powerTier || 2, origin: 'HTTYD', starterGrowth: true, isStarter: true, tradable: false, acquiredAt: new Date().toISOString() };
}
export function isDragonTradable(dragon, owner) {
  if (!dragon || dragon.isStarter === true || dragon.tradable === false || dragon.starterOrigin) return false;
  if (owner?.starterDragonId && owner.starterDragonId === dragon.id) return false;
  // Older player profiles may have claimed a starter before the flag existed.
  if (owner?.starterClaimed && !owner.starterDragonId && owner.dragons?.[0]?.id === dragon.id) return false;
  return true;
}
export function describeDragon(d) {
  const metadata = dragonSpeciesInfo(d.species);
  return [(d.emoji || '🐉') + ' *' + d.species + '*', 'Class: ' + (d.dragonClass || d.element || 'Unknown'), 'Level: ' + d.level + ' | XP: ' + d.xp, 'HP: ' + d.hp + '/' + (d.maxHp ?? d.hp), 'ATK: ' + d.attack + ' | DEF: ' + d.defense + ' | SPD: ' + (d.speed ?? 0), 'Ability: ' + (d.ability || 'Class technique'), 'Rarity: ' + (d.rarity || metadata?.rarity || 'Uncommon') + ' | Tier ' + (d.powerTier || metadata?.powerTier || 2) + '/5', d.isStarter ? 'Trade status: Non-tradable starter' : ''].filter(Boolean).join('\n');
}
