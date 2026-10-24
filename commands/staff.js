import {updateDatabase} from '../lib/database.js';
import {roleOf,roleRank,ensureRoles} from '../lib/roles.js';
import {phoneDigits} from '../lib/identity.js';
export default {name:'staff',description:'Manage bot staff',async execute({phone,reply,args,prefix}){
 const action=args[0],kind=args[1],target=phoneDigits(args[2]);
 if(!['add','remove'].includes(action)||!['mod','owner'].includes(kind)||target.length<8||target.length>15)return reply('Usage: '+prefix+'staff add mod 267XXXXXXXX');
 const result=await updateDatabase(db=>{
 ensureRoles(db);
 const actor=roleOf(db,phone),other=roleOf(db,target);
 if(roleRank(actor)<2)return 'Bot owner permissions required.';
 if(kind==='owner'&&actor!=='creator')return 'Creator permissions required.';
 if(other==='creator')return 'Creator is protected.';
 if(other==='owner'&&actor!=='creator')return 'Cannot modify an owner.';
 const list=kind==='mod'?db.botMods:db.botOwners;
 const index=list.indexOf(target);
 if(action==='add'){
 if(other!=='player')return 'User already has a staff role.';
 list.push(target);
 }else{
 if(index<0)return 'Role not found.';
 list.splice(index,1);
 }
 return 'Staff role updated.';
 });
 return reply(result);
}};