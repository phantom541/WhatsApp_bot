import {readDatabase} from '../lib/database.js';
import {riderRank} from '../lib/rider-progression.js';
import {activeTitle} from '../lib/achievements.js';

const line='━━━━━━━━━━━━━━━━━━━━';
const safe=value=>String(value||'Dragon Rider').replace(/[\r\n*_~`]/g,'').slice(0,28);
export default {
 name:'menu',
 description:'Open the Dragon Fall command console',
 async execute({sender,reply,prefix}){
  const p=(await readDatabase()).players?.[sender];
  const c=name=>prefix+name;
  const header=[
   '╭━━━〔 🐉 *DRΔGØN FΔLL* 〕━━━╮',
   '       *PHANTOM CONSOLE*',
   '╰━━━━━━━━━━━━━━━━━━━━╯',
   '⚡ *DRAKON-PHANTOM*  |  RPG TERMINAL',
   line,
   '👤 *RIDER:* '+safe(p?.whatsappName),
   '🏷️ *RANK:* '+(p?riderRank(p):'Unregistered'),
   '🎖️ *TITLE:* '+(p?activeTitle(p):'None'),
   '🪙 *POUCH:* '+(p?.coins||0),
   line
  ];
  const sections=[
   ['🔥 *AWAKEN YOUR LEGEND*',[
    [c('register'),'Create your rider identity'],
    [c('starthunt'),'Choose your first dragon'],
    [c('profile'),'Rider status & progression']]],
   ['🐲 *DRAGON SANCTUARY*',[
    [c('dragons'),'View your collection'],
    [c('party'),'Battle-ready dragons'],
    [c('den'),'Stored dragons'],
    [c('rest'),'Recover your team']]],
   ['⚔️ *THE HUNTING GROUNDS*',[
    [c('hunt'),'Seek wild dragons'],
    [c('catch'),'Catch or challenge a dragon'],
    [c('battle fight'),'View your battle moves'],
    [c('battlefight 1'),'Use move slot 1']]],
   ['🌀 *THE SIX FORBIDDEN GATES*',[
    [c('dungeons'),'Discover dungeon gates'],
    [c('dungeon enter blue'),'Enter a gate (example)'],
    [c('dungeon next'),'Challenge the next floor'],
    [c('dungeon status'),'Check your expedition']]],
   ['💎 *REWARDS & LEGACY*',[
    [c('daily'),'Claim daily coins'],
    [c('quests'),'Daily challenges'],
    [c('achievements'),'Milestones & rewards'],
    [c('titles'),'Unlockable titles'],
    [c('leaderboard'),'Top riders']]],
   ['🛒 *TRADER\'S OUTPOST*',[
    [c('mart'),'Supplies & evolution stones'],
    [c('shop'),'Battle charms'],
    [c('bag'),'Your inventory']]]
  ];
  return reply([...header,...sections.flatMap(([title,entries])=>[
   '',
   title,
   ...entries.map(([command,description])=>'│ '+command+'\n╰─ '+description)
  ]),'',line,'_The fire is not to be feared. It is to be wielded._','🐉 *DRAGON FALL • END TRANSMISSION*'].join('\n'));
 }
};
