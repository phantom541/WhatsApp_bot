import ping from '../commands/ping.js';
import menu from '../commands/menu.js';
import register from '../commands/register.js';
import profile from '../commands/profile.js';
import { config } from '../config.js';
const commands = new Map([ping, menu, register, profile].map(c => [c.name, c]));
export async function handleMessage(sock, message) {
  const content = message.message?.ephemeralMessage?.message || message.message;
  const text = content?.conversation || content?.extendedTextMessage?.text || '';
  if (!text.startsWith(config.prefix)) return;
  const [name] = text.slice(config.prefix.length).trim().toLowerCase().split(/\s+/);
  const command = commands.get(name);
  if (!command) return;
  const jid = message.key.remoteJid;
  const sender = message.key.participant || jid;
  const reply = text => sock.sendMessage(jid, { text }, { quoted: message });
  try { await command.execute({ sender, reply, prefix: config.prefix, commands }); }
  catch (error) { console.error(`Command ${name} failed:`, error); await reply('That command failed. Please try again.'); }
}
