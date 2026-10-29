import group from '../commands/group.js';
import join from '../commands/join.js';
import leave from '../commands/leave.js';
import colossus from '../commands/colossus.js';
import pvp from '../commands/pvp.js';
import species from '../commands/species.js';
import types from '../commands/types.js';
import leaderboard from '../commands/leaderboard.js';
import achievements from '../commands/achievements.js';
import titles from '../commands/titles.js';
import trivia from '../commands/trivia.js';
import ping from '../commands/ping.js';
import menu from '../commands/menu.js';
import register from '../commands/register.js';
import profile from '../commands/profile.js';
import starter from '../commands/starter.js';
import dragons from '../commands/dragons.js';
import dragon from '../commands/dragon.js';
import classes from '../commands/classes.js';
import dungeons from '../commands/dungeons.js';
import dungeon from '../commands/dungeon.js';
import starthunt from '../commands/starthunt.js';
import starterdrgon from '../commands/starterdrgon.js';
import hunt from '../commands/hunt.js';
import battle from '../commands/battle.js';
import flee from '../commands/flee.js';
import rest from '../commands/rest.js';
import heal from '../commands/heal.js';
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
import regions from '../commands/regions.js';
import travel from '../commands/travel.js';
import evolve from '../commands/evolve.js';
import party from '../commands/party.js';
import den from '../commands/den.js';
import transfer from '../commands/transfer.js';
import spawn from '../commands/spawn.js';
import {readDatabase,updateDatabase} from '../lib/database.js';
import {roleOf,roleRank} from '../lib/roles.js';
import {phoneFromMessage} from '../lib/identity.js';
import daily from '../commands/daily.js';
import staff from '../commands/staff.js';
import quests from '../commands/quests.js';
import claimquest from '../commands/claimquest.js';
import ban from '../commands/ban.js';
import unban from '../commands/unban.js';
import botmode from '../commands/botmode.js';
import grant from '../commands/grant.js';
import staffspawn from '../commands/staffspawn.js';
import staffperks from '../commands/staffperks.js';
import stafflog from '../commands/stafflog.js';
import grantitem from '../commands/grantitem.js';
import staffheal from '../commands/staffheal.js';
import resetcooldown from '../commands/resetcooldown.js';
import setcoins from '../commands/setcoins.js';
import staffdragon from '../commands/staffdragon.js';
import inspectrider from '../commands/inspectrider.js';
import forgedragon from '../commands/forgedragon.js';
import setdragonlevel from '../commands/setdragonlevel.js';
import eyes from '../commands/eyes.js';
import grantEye from '../commands/grant-eye.js';
import { requireStarter } from '../lib/eligibility.js';
import { config } from '../config.js';
const commands = new Map([group, join, leave, achievements, titles, trivia, pvp, colossus, species, types, leaderboard, ping, menu, register, profile, starter, dragons, dragon, classes, dungeons, dungeon, starthunt, starterdrgon, hunt, battle, flee, rest, heal, catchDragon, battlefight, recruit, swap, bag, moves, replacemove, mart, shop, buy, equipcharm, use, prepare, regions, travel, evolve, party, den, transfer, spawn, daily, staff, quests, claimquest, ban, unban, botmode, grant, staffspawn, staffperks, stafflog, grantitem, staffheal, resetcooldown, setcoins, staffdragon, inspectrider, forgedragon, setdragonlevel, eyes, grantEye].map(c => [c.name, c]));
export async function handleMessage(sock, message) {
  const content = message.message?.ephemeralMessage?.message || message.message;
  const text = content?.conversation || content?.extendedTextMessage?.text || '';
  if (!text.startsWith(config.prefix)) return;
  const [name, ...args] = text.slice(config.prefix.length).trim().split(/\s+/);
  const command = commands.get(name?.toLowerCase());
  if (!command && !['hunt', 'spawn', 'battle'].includes(name?.toLowerCase())) return;
  const jid = message.key.remoteJid;
  const phone=phoneFromMessage(message);
  let sender = message.key.participant || jid;
  // WhatsApp may identify the same person with a LID in groups and a phone JID in DMs.
  // Reuse an existing profile by its stored phone number instead of creating a second rider.
  if (phone) {
    const identityDb = await readDatabase();
    if (!identityDb.players?.[sender]) {
      const existing = Object.entries(identityDb.players || {}).find(([, player]) =>
        String(player.phoneNumber || '').replace(/\D/g, '') === phone
      );
      if (existing) sender = existing[0];
    }
  }
  const reply = text => sock.sendMessage(jid, { text }, { quoted: message });
  try {
    if(jid?.endsWith('@g.us'))await updateDatabase(data=>{data.worldEvents ||= {spawns:{},battles:{},lastColossusAt:0};data.worldEvents.knownGroups ||= {};data.worldEvents.knownGroups[jid]=true});
    const db=await readDatabase();
    const resolvedPhone=phone||db.players?.[sender]?.phoneNumber||null;
    const role=roleOf(db,resolvedPhone);
    if(role!=='creator'&&(resolvedPhone&&db.botBans?.[resolvedPhone]||Object.values(db.botBans||{}).some(b=>b.jid===sender)))return reply('⛔ You are banned from Dragon Bot.');
    const rescue=['botmode','staff','ban','unban','staffperks','stafflog','group','join','leave'];
    if(db.botSettings?.enabled===false&&!rescue.includes(name?.toLowerCase()))return reply('🔌 Dragon Bot game commands are paused by staff.');
    if (['hunt', 'spawn', 'battle'].includes(name?.toLowerCase()) || command?.requiresStarter) {
      if (!await requireStarter(sender, reply, config.prefix)) return;
    }
    if (!command) return reply('That feature is not available yet.');
    await command.execute({ sender, reply, prefix: config.prefix, commands, args, sock, message, phone:resolvedPhone });
    if (name?.toLowerCase() !== 'leaderboard') await updateDatabase(data => { const p=data.players?.[sender]; if(p){p.engagement ||= {};p.engagement.commands=(p.engagement.commands||0)+1;p.engagement.lastActiveAt=new Date().toISOString();} });
  }
  catch (error) { console.error('Command ' + name + ' failed:', error); await reply('That command failed. Please try again.'); }
}
