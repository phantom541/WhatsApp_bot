import {updateDatabase} from '../lib/database.js';
import {ensureCollection,PARTY_LIMIT} from '../lib/collection.js';
export default {name:'transfer',requiresStarter:true,description:'Move dragons between party and den',async execute({sender,reply,args,prefix}){
 const index=Number(args[0])-1,destination=(args[1]||'').toLowerCase();
 if(!Number.isInteger(index)||index<0||!['party','den'].includes(destination))return reply('Usage: '+prefix+'transfer 3 party (collection index)');
 const result=await updateDatabase(db=>{
 const p=db.players[sender];ensureCollection(p);
 if(p.activeEncounter)return 'Cannot transfer during battle.';
 const d=p.dragons[index];if(!d)return 'Dragon not found.';
 if(p[destination].includes(d.id))return 'Dragon is already in '+destination+'.';
 if(destination==='party'&&p.party.length>=PARTY_LIMIT)return 'Party is full (six dragons).';
 if(destination==='den'&&p.party.length===1)return 'Keep at least one dragon in your party.';
 p.party=p.party.filter(id=>id!==d.id);p.den=p.den.filter(id=>id!==d.id);p[destination].push(d.id);
 if(p.activeDragonId===d.id&&destination==='den')p.activeDragonId=p.party[0];
 return d.species+' moved to '+destination+'.';
 });
 return reply('🐉 '+result);
}};
