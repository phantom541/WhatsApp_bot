import {readDatabase} from '../lib/database.js';
import {eyeCollection} from '../lib/sea-eyes.js';
import {sendSeaEyeImage} from '../lib/sea-eye-images.js';

export default {
  name:'eyes',
  description:'View the Seven Eyes of the Seven Seas collection',
  async execute({sender,reply,prefix,sock,message}){
    const db=await readDatabase();
    const player=db.players?.[sender];
    if(!player)return reply('Register first with '+prefix+'register.');
    const eyes=eyeCollection(player);
    const defeated=player.colossalBeastsDefeated?.length||0;
    const owned=eyes.filter(eye=>eye.owned).length;
    await reply(
      '🌊 *THE SEVEN EYES OF THE SEAS*\\n━━━━━━━━━━━━━━━━\\n'+
      eyes.map((eye,i)=>(eye.owned?'🔹':'🔒')+' '+(i+1)+'. Eye of '+eye.name+' | '+eye.power+
        (eye.owned?' • OWNED':' • LOCKED')+'\\n   Colossus: '+eye.beastName).join('\\n')+
      '\\n━━━━━━━━━━━━━━━━\\n👁️ Eyes: '+owned+'/7'+
      '\\n🌌 Unique Colossi defeated: '+defeated+'/7'+
      '\\n\\nEach Eye is linked to its Colossus. Defeat the linked Colossus to earn it, or receive a Creator gift.\\n🖼️ Eye artwork follows.'
    );
    for(const eye of eyes){
      const caption=(eye.owned?'🔹 *OWNED':'🔒 *LOCKED')+' | *Eye of '+eye.name+'*\\nPower: '+eye.power+'\\nLinked Colossus: '+eye.beastName;
      await sendSeaEyeImage(sock,message.key.remoteJid,eye,caption,message);
    }
  }
};
