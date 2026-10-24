export const PARTY_LIMIT=6;
export function ensureCollection(p) {
 if (!Array.isArray(p.dragons)) p.dragons=[];
 if (!Array.isArray(p.party)) p.party=p.dragons.slice(0,PARTY_LIMIT).map(d=>d.id);
 if (!Array.isArray(p.den)) p.den=p.dragons.filter(d=>!p.party.includes(d.id)).map(d=>d.id);
}
export function addDragon(p,d,choice='auto') {
 ensureCollection(p);
 p.dragons.push(d);
 const destination=choice==='den'||p.party.length>=PARTY_LIMIT?'den':'party';
 p[destination].push(d.id);
 return destination;
}
export function activeDragon(p) {
 ensureCollection(p);
 return p.dragons.find(d=>d.id===p.activeDragonId&&p.party.includes(d.id)&&d.hp>0)||
 p.dragons.find(d=>p.party.includes(d.id)&&d.hp>0);
}
