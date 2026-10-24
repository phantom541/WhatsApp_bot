import {readDatabase} from '../lib/database.js';
import {roleOf} from '../lib/roles.js';
export default {name:'staffperks',description:'Show bot-wide role privileges',async execute({phone,reply,prefix}){
 const role=roleOf(await readDatabase(),phone);
 const lines=[
 'PLAYER: random hunting, daily quests, Mart and Shop.',
 'BOT MOD: ban/unban, toggle bot, named dragon spawns, coins/items grants, collection healing, inspect rider, staff audit, choose region, faster hunt/spawn.',
 'BOT OWNER: all mod perks, appoint/remove mods, grant named dragons, reset player cooldowns.',
 'CREATOR: all owner perks, assign/demote owners and mods, set coins, forge rarity/level dragons, set existing dragon levels.'
 ];
 return reply('🛡️ Your bot role: '+role.toUpperCase()+'\n'+lines.join('\n')+'\nMore: '+prefix+'stafflog');
}};
