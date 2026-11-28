import {ensureMoves} from './moves.js';
import {dragonProfile} from './dragon-combat-profile.js';

const clean = value => String(value || 'Dragon Rider').replace(/[\r\n*_~`]/g, '').slice(0, 40);
const tag = jid => jid === 'wild' ? 'Wild Dragon' : '@' + String(jid || '').split('@')[0].split(':')[0];

function dragonLine(player, dragon) {
  ensureMoves(dragon);
  const type = dragon.combatType || dragon.type || dragonProfile(dragon.species, dragon.dragonClass || dragon.element).type;
  const hp = Math.max(0, Number(dragon.hp) || 0);
  const maxHp = Math.max(hp, Number(dragon.maxHp) || hp);
  return '*' + tag(player.jid) + '* - ' + clean(dragon.species) +
    ' (HP: ' + hp + ' / ' + maxHp + ' | Level: ' + (Number(dragon.level) || 1) +
    ' | Moves: ' + dragon.moves.length + ' | Type: ' + clean(String(type).charAt(0).toUpperCase() + String(type).slice(1)) + ')';
}

export function battleStartedText(players) {
  return '🌀 *Dragon Battle Started!* 🌀\n\n' +
    players.map(({ player, dragon }) => dragonLine({ jid: player.jid }, dragon)).join('\n\n');
}
