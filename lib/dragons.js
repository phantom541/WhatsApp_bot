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
export function createStarter(key) {
  const d = DRAGON_CLASSES[key];
  if (!d) return null;
  return { id: randomUUID(), species: d.starter, dragonClass: d.label, element: d.label, emoji: d.emoji, level: 1, xp: 0, hp: d.hp, maxHp: d.hp, attack: d.attack, defense: d.defense, speed: d.speed, ability: d.ability, acquiredAt: new Date().toISOString() };
}
export function describeDragon(d) {
  return [(d.emoji || '🐉') + ' *' + d.species + '*', 'Class: ' + (d.dragonClass || d.element || 'Unknown'), 'Level: ' + d.level + ' | XP: ' + d.xp, 'HP: ' + d.hp + '/' + (d.maxHp ?? d.hp), 'ATK: ' + d.attack + ' | DEF: ' + d.defense + ' | SPD: ' + (d.speed ?? 0), 'Ability: ' + d.ability].join('\n');
}
