import {randomInt} from 'node:crypto';
import {updateDatabase} from '../lib/database.js';
const QUESTIONS=[
 {q:'Which class is known for speed and accuracy?',options:['Strike','Boulder','Tidal'],answer:1},
 {q:'Which class specializes in aquatic defense?',options:['Sharp','Mystery','Tidal'],answer:3},
 {q:'What is the maximum number of dragons in your party?',options:['6','8','12'],answer:1},
 {q:'How many floors does a dungeon have?',options:['5','10','15'],answer:2},
 {q:'How many dragon classes are there?',options:['5','6','7'],answer:3},
 {q:'Which command opens your dragon collection?',options:['_den','_dragons','_shop'],answer:2}
];
const COOLDOWN=120000;
export default {name:'trivia',description:'Play a dragon knowledge mini-game',async execute({sender,args,reply,prefix}){
 const choice=Number(args[0]),now=Date.now();
 const result=await updateDatabase(db=>{
  const p=db.players?.[sender];if(!p)return {error:'Register first with '+prefix+'register.'};
  const game=p.triviaGame;
  if(args.length&&Number.isInteger(choice)&&choice>=1&&choice<=3){
   if(!game||game.answered)return {error:'No active question. Use '+prefix+'trivia.'};
   if(now-game.startedAt>120000){p.triviaGame=null;return {error:'Question expired. Use '+prefix+'trivia for a new one.'};}
   const correct=choice===QUESTIONS[game.index].answer;
   p.triviaGame=null;
   p.triviaStats??={played:0,correct:0};
   p.triviaStats.played++;if(correct)p.triviaStats.correct++;
   return {answer:true,correct,correctOption:QUESTIONS[game.index].options[QUESTIONS[game.index].answer-1]};
  }
  if(args.length)return {error:'Use '+prefix+'trivia or '+prefix+'trivia 1/2/3.'};
  if(game&&now-game.startedAt<=120000){
   const q=QUESTIONS[game.index];return {question:q};
  }
  const wait=COOLDOWN-(now-(p.lastTriviaAt||0));
  if(wait>0)return {error:'Next trivia round in '+Math.ceil(wait/1000)+' seconds.'};
  const index=randomInt(QUESTIONS.length);p.lastTriviaAt=now;p.triviaGame={index,startedAt:now};
  return {question:QUESTIONS[index]};
 });
 if(result.error)return reply(result.error);
 if(result.answer)return reply(result.correct?'🏆 Correct! Dragon knowledge confirmed.':'📚 Not quite. Correct answer: '+result.correctOption+'.');
 return reply('🧠 *DRAGON TRIVIA*\n━━━━━━━━━━━━━━━━\n'+result.question.q+'\n'+result.question.options.map((o,i)=>(i+1)+'. '+o).join('\n')+'\n━━━━━━━━━━━━━━━━\nAnswer with '+prefix+'trivia 1, 2 or 3. You have 2 minutes.');
}};