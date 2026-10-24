import {readDatabase} from '../lib/database.js';
import {roleOf} from '../lib/roles.js';
export default {name:'staffperks',description:'Show bot staff privileges',async execute({phone,reply,prefix}){
 const role=roleOf(await readDatabase(),phone);
 const text=['PLAYER: daily rewards, regular random hunting','MOD: ban/unban, botmode, staffspawn, grant, region selection, staff audit and shorter spawn cooldown','OWNER: all mod perks plus appoint/remove moderators','CREATOR: all perks plus appoint/remove owners and staff oversight'];
 return reply('🛡️ Your role: '+role.toUpperCase()+'\n'+text.join('\n')+'\nUse '+prefix+'stafflog for recent staff actions.');
}};
