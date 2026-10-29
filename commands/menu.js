import {readDatabase} from '../lib/database.js';
import {riderRank} from '../lib/rider-progression.js';
import {activeTitle} from '../lib/achievements.js';

const line = '━━━━━━━━━━━━━━━━━━━━';
const safe = value => String(value || 'Dragon Rider').replace(/[\r\n*_~`]/g, '').slice(0, 28);

export default {
  name: 'menu',
  description: 'Open the Dragon Fall command console',
  async execute({sender, reply, prefix}) {
    const p = (await readDatabase()).players?.[sender];
    const c = name => prefix + name;
    const header = [
      '╭━━━〔 🐉 *DRΔGØN FΔLL* 〕━━━╮',
      '       *PHANTOM CONSOLE*',
      '╰━━━━━━━━━━━━━━━━━━━━╯',
      '⚡ *DRAKON-PHANTOM* | RPG TERMINAL',
      line,
      '👤 *RIDER:* ' + safe(p?.whatsappName),
      '🏷️ *RANK:* ' + (p ? riderRank(p) : 'Unregistered'),
      '🎖️ *TITLE:* ' + (p ? activeTitle(p) : 'None'),
      '🪙 *POUCH:* ' + (p?.coins || 0),
      line
    ];
    const sections = [
      ['👑 *RIDER LEGACY*', [
        [c('profile'), 'Rider identity & progression'],
        [c('register'), 'Register as a rider']
      ]],
      ['🐲 *DRAGON SANCTUARY*', [
        [c('dragons'), 'View your collection'],
        [c('dragon 1'), 'Inspect by collection number'],
        [c('species'), 'Browse the bestiary'],
        [c('types'), 'View elemental type matchups'],
        [c('classes'), 'Browse dragon classes'],
        [c('party'), 'View your six-dragon party'],
        [c('den'), 'Stored dragons'],
        [c('moves'), 'Inspect dragon moves'],
        [c('evolve'), 'Evolve an eligible dragon'],
        [c('transfer'), 'Move dragons between party and den'],
        [c('rest'), 'Recover your team'],
        [c('heal'), 'Heal a dragon or your team'],
        [c('recruit'), 'Recruit a dragon into your party'],
        [c('swap'), 'Swap party positions'],
        [c('prepare'), 'Prepare for an expedition']
      ]],
      ['⚔️ *THE HUNTING GROUNDS*', [
        [c('hunt'), 'Seek wild dragons'],
        [c('spawn'), 'See the active dragon spawn'],
        [c('catch'), 'Catch or challenge a spawned dragon'],
        [c('battle'), 'Start a battle'],
        [c('battlefight 1'), 'Use a battle move'],
        [c('flee'), 'Flee from battle'],
        [c('colossus'), 'Check Colossal Beasts']
      ]],
      ['🧭 *REALMS & TRAVEL*', [
        [c('regions'), 'Discover regions'],
        [c('travel'), 'Travel between unlocked regions']
      ]],
      ['🌀 *THE SIX FORBIDDEN GATES*', [
        [c('dungeons'), 'Discover dungeon gates'],
        [c('dungeon'), 'View or enter a dungeon']
      ]],
      ['🎮 *PHANTOM ARCADE*', [
        [c('trivia'), 'Dragon trivia'],
        [c('pvp'), 'Player versus player']
      ]],
      ['🌊 *THE SEVEN EYES*', [
        [c('eyes'), 'Seven Eyes collection and Colossal progress']
      ]],
      ['💎 *REWARDS & LEGACY*', [
        [c('daily'), 'Claim daily coins'],
        [c('quests'), 'View quests'],
        [c('claimquest'), 'Claim a completed quest'],
        [c('achievements'), 'Milestones and rewards'],
        [c('titles'), 'Unlockable titles'],
        [c('leaderboard'), 'Top riders']
      ]],
      ['🛒 *TRADER’S OUTPOST*', [
        [c('mart'), 'Supplies and evolution stones'],
        [c('shop'), 'Battle charms'],
        [c('equipcharm'), 'Equip a battle charm'],
        [c('buy'), 'Purchase an item'],
        [c('bag'), 'Your inventory'],
        [c('use'), 'Use an item']
      ]],
      ['🛡️ *STAFF & MANAGEMENT*', [
        [c('staff'), 'Staff tools'],
        [c('stafflog'), 'Staff audit log'],
        [c('group'), 'Group settings'],
        [c('ping'), 'Check bot response']
      ]]
    ];
    const body = sections.flatMap(([title, entries]) => [
      '',
      title,
      ...entries.map(([command, description]) => '│ ' + command + '\n╰─ ' + description)
    ]);
    return reply([...header, ...body, '', line, '_The fire is not to be feared. It is to be wielded._', '🐉 *DRAGON FALL • END TRANSMISSION*'].join('\n'));
  }
};
