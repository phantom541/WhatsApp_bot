import ping from '../commands/ping.js';
import menu from '../commands/menu.js';
import register from '../commands/register.js';
import profile from '../commands/profile.js';
import starter from '../commands/starter.js';
import dragons from '../commands/dragons.js';
import dragon from '../commands/dragon.js';
import classes from '../commands/classes.js';
import starthunt from '../commands/starthunt.js';
import starterdrgon from '../commands/starterdrgon.js';
import hunt from '../commands/hunt.js';
import battle from '../commands/battle.js';
import flee from '../commands/flee.js';
import rest from '../commands/rest.js';
import catchDragon from '../commands/catch.js';
import battlefight from '../commands/battlefight.js';
import recruit from '../commands/recruit.js';
import swap from '../commands/swap.js';
import bag from '../commands/bag.js';
import moves from '../commands/moves.js';
import replacemove from '../commands/replacemove.js';
import mart from '../commands/mart.js';
import shop from '../commands/shop.js';
import buy from '../commands/buy.js';
import equipcharm from '../commands/equipcharm.js';
import use from '../commands/use.js';
import prepare from '../commands/prepare.js';
import { requireStarter } from '../lib/eligibility.js';
import { config } from '../config.js';
const commands = new Map([ping, menu, register, profile, starter, dragons, dragon, classes, starthunt, starterdrgon, hunt, battle, flee, rest, catchDragon, battlefight, recruit, swap, bag, moves, replacemove, mart, shop, buy, equipcharm, use, prepare].map(c => [c.name, c]));
export async function handleMessage(sock, message) {
  const content = message.message?.ephemeralMessage?.message || message.message;
  const text = content?.conversation || content?.extendedTextMessage?.text || '';
  if (!text.startsWith(config.prefix)) return;
  const [name, ...args] = text.slice(config.prefix.length).trim().split(/\s+/);
  const command = commands.get(name?.toLowerCase());
  if (!command && !['hunt', 'spawn', 'battle'].includes(name?.toLowerCase())) return;
  const jid = message.key.remoteJid;
  const sender = message.key.participant || jid;
  const reply = text => sock.sendMessage(jid, { text }, { quoted: message });
  try {
    if (['hunt', 'spawn', 'battle'].includes(name?.toLowerCase()) || command?.requiresStarter) {
      if (!await requireStarter(sender, reply, config.prefix)) return;
    }
    if (!command) return reply('That feature is not available yet.');
    await command.execute({ sender, reply, prefix: config.prefix, commands, args });
  }
  catch (error) { console.error('Command ' + name + ' failed:', error); await reply('That command failed. Please try again.'); }
}
