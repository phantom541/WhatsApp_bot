import {readDatabase} from '../lib/database.js';
import {MART_PAGES,CHARMS} from '../lib/catalog.js';
import {inventoryCount} from '../lib/items.js';

const CATEGORIES=[
 ...MART_PAGES,
 {title:'Charms',items:Object.values(CHARMS)}
];
const clean=value=>String(value??'').replace(/[\\r\\n*_~`]/g,'').trim().slice(0,48);
const slug=value=>String(value??'').toLowerCase().replace(/[^a-z0-9]+/g,'');

export default {
 name:'bag',
 requiresStarter:true,
 description:'View your inventory by category',
 async execute({sender,reply,args=[],prefix}){
  const p=(await readDatabase()).players?.[sender];
  if(!p)return reply('Register first with '+prefix+'register.');
  const owned=CATEGORIES.map(category=>({
   ...category,
   entries:category.items.map(item=>({
    name:item.name,
    description:item.description||'A useful item for your adventure.',
    count:inventoryCount(p,item.id)
   })).filter(item=>item.count>0)
  }));
  const available=owned.filter(category=>category.entries.length);
  if(!available.length)return reply('🎒 *BAG*\\nYour bag is empty.\\n\\nBrowse '+prefix+'mart 1 to find supplies.');
  const requested=slug(args[0]);
  let categoryIndex=0;
  if(requested){
   const found=owned.findIndex(category=>slug(category.title)===requested||category.entries.some(item=>slug(item.name)===requested));
   if(found>=0)categoryIndex=found;
   else if(/^\\d+$/.test(String(args[0])))categoryIndex=Math.max(0,Math.min(owned.length-1,Number(args[0])-1));
   else return reply('Category not found.\\n'+owned.map((category,i)=>(i+1)+'. '+category.title).join('\\n')+'\\n\\nUse '+prefix+'bag <category>.');
  }else{
   categoryIndex=owned.findIndex(category=>category.entries.length);
  }
  const category=owned[categoryIndex];
  const pageSize=7;
  const totalItems=category.entries.reduce((sum,item)=>sum+item.count,0);
  const totalPages=Math.max(1,Math.ceil(category.entries.length/pageSize));
  const pageArg=Number(args[1]);
  const page=Number.isInteger(pageArg)&&pageArg>0?Math.min(pageArg,totalPages):1;
  const start=(page-1)*pageSize;
  const lines=category.entries.slice(start,start+pageSize).map((item,index)=>[
   '*#'+(start+index+1)+'*',
   '🎈 *Item:* '+clean(item.name)+' (x'+item.count+')',
   '🧧 *Description:* '+clean(item.description)
  ].join('\\n'));
  const tag=clean(p.playerId||'Unassigned');
  const username=clean(p.username||p.whatsappName||p.displayName||sender.split('@')[0]);
  return reply([
   '🎒 *BAG*',
   '🎴 *ID:*',
   '🏮 *Username:* '+username,
   '🧧 *Tag:* '+tag,
   '',
   '🎗 *Category:* '+category.title,
   '〽 *Total Items:* '+totalItems,
   '📘 *Current Page:* '+page,
   '📕 *Total Pages:* '+totalPages,
   '━━━━━━━━━━━━━━━━',
   ...lines.flatMap((line,index)=>index===0?[line]:['',line]),
   '',
   'Use '+prefix+'bag <category> [page] to browse another category/page.',
   'Categories: '+owned.map(x=>x.title).join(' • ')
  ].join('\\n'));
 }
};
