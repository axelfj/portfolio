import {random} from './evolution'
export type Card={id:number;suit:number;rank:number}
export const suitSymbols=['♠','♣','♦','♥']
export const cardValue=(c:Card)=>c.rank>10?.5:c.rank
export const cardLabel=(c:Card)=>(['','A','2','3','4','5','6','7','8','9','10','J','Q','K'][c.rank])+suitSymbols[c.suit]
export type PoisonState={hands:Card[][];piles:Card[][];won:Card[][];deck:Card[];scores:number[];roundScores:number[];active:number[];turn:number;round:number;finished:boolean;roundOver:boolean;log:string;escaped:number[]}
export function poisonInitial(players=2,seed=42):PoisonState{players=Math.max(2,Math.min(6,Math.floor(players)));const s:PoisonState={hands:Array.from({length:players},()=>[]),piles:[[],[],[]],won:Array.from({length:players},()=>[]),deck:[],scores:Array(players).fill(0),roundScores:Array(players).fill(0),active:Array.from({length:players},(_,i)=>i),turn:0,round:1,finished:false,roundOver:false,log:'Choose a card, then a cauldron.',escaped:[]};dealRound(s,seed);return s}
function dealRound(s:PoisonState,seed:number){const rng=random(seed+s.round);s.deck=Array.from({length:52},(_,id)=>({id,suit:Math.floor(id/13),rank:id%13+1}));for(let i=51;i>0;i--){const j=Math.floor(rng()*(i+1));[s.deck[i],s.deck[j]]=[s.deck[j],s.deck[i]]}s.hands=s.hands.map(()=>[]);s.won=s.won.map(()=>[]);s.piles=[[],[],[]];s.turn=s.active[0];s.roundOver=false;redeal(s)}
function redeal(s:PoisonState){const count=9-s.active.length;if(s.deck.length<count*s.active.length){endRound(s);return}for(const p of s.active)s.hands[p]=s.deck.splice(0,count)}
function endRound(s:PoisonState){s.roundScores=s.won.map(h=>h.filter(c=>c.suit===3).length);s.roundScores.forEach((v,i)=>s.scores[i]+=v);s.roundOver=true
  if(s.active.length===2){s.finished=true;const [a,b]=s.active;const loser=s.scores[a]===s.scores[b]?'Tie':`Player ${(s.scores[a]>s.scores[b]?a:b)+1} loses`;s.log=`Game over. ${loser}. Fewer poison cards is better.`;return}
  const escape=[...s.active].sort((a,b)=>s.roundScores[a]-s.roundScores[b]||a-b)[0];s.active=s.active.filter(p=>p!==escape);s.escaped.push(escape);s.log=`Round over. Player ${escape+1} escapes with the fewest hearts. Ties use player order.`
}
export function poisonLegal(s:PoisonState,card:Card,pile:number){if(s.finished||s.roundOver||!s.hands[s.turn].some(c=>c.id===card.id)||pile<0||pile>2)return false;const target=s.piles[pile];if(card.suit===3)return target.length>0||s.hands[s.turn].length===1;const base=target.find(c=>c.suit!==3);if(base)return base.suit===card.suit;return !s.piles.some((p,i)=>i!==pile&&p.some(c=>c.suit===card.suit))}
export function poisonPlay(s:PoisonState,id:number,pile:number){const c=s.hands[s.turn].find(c=>c.id===id);if(!c||!poisonLegal(s,c,pile))return false;const p=s.turn;s.hands[p]=s.hands[p].filter(c=>c.id!==id);s.piles[pile].push(c);const sum=s.piles[pile].reduce((a,c)=>a+cardValue(c),0);s.log=`Player ${p+1} plays ${cardLabel(c)}.`;if(sum>13){s.won[p].push(...s.piles[pile]);s.piles[pile]=[];s.log+=' Cauldron exceeds 13: collect its cards.'}
  if(s.active.every(i=>s.hands[i].length===0))redeal(s)
  if(!s.roundOver){let i=s.active.indexOf(p),found=false;for(let n=0;n<s.active.length;n++){i=(i+1)%s.active.length;s.turn=s.active[i];if(s.hands[s.turn].some(c=>[0,1,2].some(pile=>poisonLegal(s,c,pile)))){found=true;break}}if(!found){endRound(s);s.log+=' All players were blocked; the round ends.'}}return true
}
export function poisonNext(s:PoisonState,seed=42){if(!s.roundOver||s.finished)return false;s.round++;dealRound(s,seed);s.log='New round. Choose a card and cauldron.';return true}
