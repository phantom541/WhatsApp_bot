export const ITEMS=Object.freeze({
 potion:{name:'Potion',price:25,heal:40,description:'Restore 40 HP to active dragon'},
 superpotion:{name:'Super Potion',price:65,heal:100,description:'Restore 100 HP to active dragon'},
 guardtonic:{name:'Guard Tonic',price:40,guard:0.5,description:'Halve damage from the next enemy attack'}
});
export function inventoryCount(p,key){return (p.inventory||[]).reduce((n,x)=>n+(typeof x==='string'?(x.toLowerCase().replace(/\s+/g,'')===key?1:0):(x?.id===key||x?.name?.toLowerCase().replace(/\s+/g,'')===key?x.quantity||1:0)),0);}
export function consumeItem(p,key){
 const i=(p.inventory||[]).findIndex(x=>typeof x==='string'?x.toLowerCase().replace(/\s+/g,'')===key:x?.id===key||x?.name?.toLowerCase().replace(/\s+/g,'')===key);
 if(i<0)return false;
 const x=p.inventory[i];
 if(typeof x==='object'&&x.quantity>1)x.quantity--;else p.inventory.splice(i,1);
 return true;
}
export function giveItem(p,key,quantity=1){if(!Array.isArray(p.inventory))p.inventory=[];for(let i=0;i<quantity;i++)p.inventory.push(key);}
