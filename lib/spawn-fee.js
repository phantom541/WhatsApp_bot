export const DRAGON_SPAWN_FEE=100000;

export function checkDragonSpawnFunds(p){
 const balance=Math.max(0,Number(p?.coins)||0);
 if(balance<DRAGON_SPAWN_FEE)return {error:'Not enough coins in your pouch. Spawning a dragon costs '+DRAGON_SPAWN_FEE.toLocaleString('en-US')+' coins; your pouch has '+balance.toLocaleString('en-US')+'. Your bank is not used.'};
 return {balance};
}

export function chargeDragonSpawn(p){
 const funds=checkDragonSpawnFunds(p);
 if(funds.error)return funds;
 p.coins=funds.balance-DRAGON_SPAWN_FEE;
 return {balance:p.coins};
}
