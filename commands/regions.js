import {REGIONS} from '../lib/regions.js';
export default {name:'regions',requiresStarter:true,description:'Explore seven hunting regions',async execute({reply,prefix}){
 return reply('🗺️ *Hunting Regions*\n'+Object.entries(REGIONS).map(([key,r])=>'• '+r.name+' ('+key+') | Lv '+r.minLevel+'-'+r.maxLevel).join('\n')+'\n\nChoose: '+prefix+'travel forest');
}};
