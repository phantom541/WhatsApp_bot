import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const dir=await mkdtemp(join(tmpdir(),'dragon-bot-staff-'));
process.env.DB_PATH=join(dir,'state.json');
process.env.BOT_OWNER_NUMBERS='26770000001';

const {updateDatabase,readDatabase}=await import('../lib/database.js');
const {roleOf}=await import('../lib/roles.js');
const {handleMessage}=await import('../handlers/commands.js');
const staff=(await import('../commands/staff.js')).default;
const grant=(await import('../commands/grant.js')).default;
const ban=(await import('../commands/ban.js')).default;
const unban=(await import('../commands/unban.js')).default;
const botmode=(await import('../commands/botmode.js')).default;
const staffspawn=(await import('../commands/staffspawn.js')).default;
const grantitem=(await import('../commands/grantitem.js')).default;
const daily=(await import('../commands/daily.js')).default;

const creator='26770000001',mod='26770000002',player='26770000003';
const jid=n=>n+'@s.whatsapp.net';
let replyText='';
const execute=async(command,phone,args=[],sender=jid(phone))=>{
 replyText='';
 await command.execute({phone,args,sender,prefix:'_',reply:async text=>{replyText=text;}});
 return replyText;
};
const mockMessage=(n,text)=>({key:{remoteJid:jid(n)},message:{conversation:text},pushName:'Test Rider'});
const messages=[];
const sock={sendMessage:async(_,{text})=>{messages.push(text);}};

test('setup test riders',async()=>{
 await updateDatabase(db=>{
  for(const n of [creator,mod,player])db.players[jid(n)]={phoneNumber:n,whatsappName:'Test Rider',playerId:'Test_Rider#'+n.slice(-4),coins:10,level:1,xp:0,inventory:[],dragons:[]};
 });
 const db=await readDatabase();
 assert.equal(roleOf(db,creator),'creator');
 assert.equal(roleOf(db,mod),'player');
});
test('creator appoints moderator; mod cannot appoint owner',async()=>{
 assert.match(await execute(staff,creator,['add','mod',mod]),/updated/);
 assert.equal(roleOf(await readDatabase(),mod),'mod');
 assert.match(await execute(staff,mod,['add','owner',player]),/required/);
});
test('mods can grant coins and items but not set owner role',async()=>{
 assert.match(await execute(grant,mod,[player,'500']),/Granted/);
 assert.equal((await readDatabase()).players[jid(player)].coins,510);
 assert.match(await execute(grant,mod,['me','100']),/Granted/);
 assert.match(await execute(grantitem,mod,[player,'potion','2']),/Granted/);
 assert.equal((await readDatabase()).players[jid(player)].inventory.length,2);
});
test('mods cannot ban creator; player bans are enforced by router',async()=>{
 assert.match(await execute(ban,mod,[creator,'test']),/Cannot ban/);
 assert.match(await execute(ban,mod,[player,'test']),/banned/);
 await handleMessage(sock,mockMessage(player,'_profile'));
 assert.match(messages.at(-1),/banned/);
 assert.match(await execute(unban,mod,[player]),/lifted/);
});
test('bot pauses player commands, staff can turn it on',async()=>{
 assert.match(await execute(botmode,mod,['off']),/OFF/);
 await handleMessage(sock,mockMessage(player,'_profile'));
 assert.match(messages.at(-1),/paused/);
 assert.match(await execute(botmode,mod,['on']),/ON/);
});
test('staff can spawn a chosen species and claim daily rewards',async()=>{
 assert.match(await execute(staffspawn,mod,['skrill']),/Skrill/);
 assert.equal((await readDatabase()).players[jid(mod)].activeEncounter.species,'Skrill');
 assert.match(await execute(daily,mod,[],jid(mod)),/65/);
 assert.match(await execute(daily,mod,[],jid(mod)),/Already claimed/);
});
test('cleanup',async()=>{await rm(dir,{recursive:true,force:true});});
