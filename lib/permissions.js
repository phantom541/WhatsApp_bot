import {readDatabase} from './database.js';
import {roleOf,roleRank} from './roles.js';
export async function isRegionSelector(sock,message,sender,phone){
 if(!phone)return false;
 const db=await readDatabase();
 return roleRank(roleOf(db,phone))>=1;
}
