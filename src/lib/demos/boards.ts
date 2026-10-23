export const winningLines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
export function winner(b:number[]) { for(const l of winningLines)if(b[l[0]]&&l.every(i=>b[i]===b[l[0]]))return b[l[0]];return b.every(Boolean)?3:0 }
export function minimax(b:number[],turn:number):number {const w=winner(b);if(w)return w===3?0:w===2?1:-1;const scores=b.flatMap((v,i)=>{if(v)return [];const c=[...b];c[i]=turn;return [minimax(c,3-turn)]});return turn===2?Math.max(...scores):Math.min(...scores)}
export function ticScores(b:number[]) {return b.map((v,i)=>{if(v)return null;const c=[...b];c[i]=2;return minimax(c,1)})}
export type Piece = {id:number;side:number;rank:number;x:number;y:number}
export const animals=['','Rat','Cat','Wolf','Dog','Leopard','Tiger','Lion','Elephant']
export function jungleInitial():Piece[]{const top=[[0,0,7],[6,0,6],[1,1,4],[5,1,2],[0,2,1],[2,2,5],[4,2,3],[6,2,8]];return [1,2].flatMap(side=>top.map(([x,y,rank],i)=>({id:(side-1)*8+i,side,rank,x:side===1?x:6-x,y:side===1?y:8-y}))) }
export const water=(x:number,y:number)=>y>=3&&y<=5&&[1,2,4,5].includes(x)
export const den=(x:number,y:number)=>x===3&&(y===0?1:y===8?2:0)
export const trap=(x:number,y:number)=>(y===0&&(x===2||x===4))||(y===1&&x===3)?1:(y===8&&(x===2||x===4))||(y===7&&x===3)?2:0
export function jungleMoves(p:Piece,board:Piece[]) {
  const moves:{x:number;y:number}[]=[]
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let x=p.x+dx,y=p.y+dy
    if(water(x,y)&&[6,7].includes(p.rank)){let blocked=false;while(water(x,y)){if(board.some(a=>a.x===x&&a.y===y))blocked=true;x+=dx;y+=dy}if(blocked)continue}
    if(x<0||x>6||y<0||y>8||den(x,y)===p.side||water(x,y)&&p.rank!==1)continue
    const q=board.find(a=>a.x===x&&a.y===y);if(q?.side===p.side)continue
    if(q){if(water(p.x,p.y)!==water(x,y))continue;const pr=p.rank,qr=trap(x,y)===3-q.side?0:q.rank
      if(qr!==0&&((pr===8&&qr===1)||!(pr>=qr||pr===1&&qr===8)))continue}
    moves.push({x,y})
  }return moves
}
export type Soldier={id:number;side:number;kind:string;x:number;y:number;hp:number;acted:boolean}
export const units:Record<string,{hp:number;attack:number;defense:number;range:number;move:number;cost:number;symbol:string}>={Archer:{hp:15,attack:10,defense:5,range:3,move:1,cost:4,symbol:'A'},Cavalry:{hp:25,attack:15,defense:5,range:1,move:3,cost:5,symbol:'C'},Spearman:{hp:20,attack:10,defense:10,range:1,move:1,cost:3,symbol:'S'}}
export function battleTargets(p:Soldier,board:Soldier[]){const t=units[p.kind],result:{x:number;y:number;attack:boolean}[]=[];if(p.acted)return result
  const queue=[{x:p.x,y:p.y,d:0}],seen=new Set([p.x+','+p.y]);while(queue.length){const c=queue.shift()!;if(c.d>=t.move)continue;for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=c.x+dx,y=c.y+dy,key=x+','+y;if(x<0||x>7||y<0||y>7||seen.has(key)||board.some(q=>q.x===x&&q.y===y))continue;seen.add(key);result.push({x,y,attack:false});queue.push({x,y,d:c.d+1})}}
  board.filter(q=>q.side!==p.side&&Math.abs(q.x-p.x)+Math.abs(q.y-p.y)<=t.range).forEach(q=>result.push({x:q.x,y:q.y,attack:true}));return result
}
