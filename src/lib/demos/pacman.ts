export const MAZE = [
  '#####################',
  '#o........#........o#',
  '#.###.###.#.###.###.#',
  '#...................#',
  '#.###.#.#####.#.###.#',
  '#.....#...#...#.....#',
  '#####.### # ###.#####',
  '#####.#       #.#####',
  '#####.# ## ## #.#####',
  '#.......#   #.......#',
  '#####.# #   # #.#####',
  '#####.# ##### #.#####',
  '#####.#       #.#####',
  '#.........#.........#',
  '#.###.###.#.###.###.#',
  '#o..#..... .....#..o#',
  '###.#.#.#####.#.#.###',
  '#.....#...#...#.....#',
  '#.#######.#.#######.#',
  '#...................#',
  '#####################',
]
export const WIDTH = 21
export type Direction = 'up'|'down'|'left'|'right'
export const vectors: Record<Direction,number>={up:-WIDTH,down:WIDTH,left:-1,right:1}
export const distance=(a:number,b:number)=>Math.abs(a%WIDTH-b%WIDTH)+Math.abs(Math.floor(a/WIDTH)-Math.floor(b/WIDTH))
export const walkable=(p:number)=>p>=0&&p<WIDTH*MAZE.length&&MAZE[Math.floor(p/WIDTH)][p%WIDTH]!=='#'
export function neighbors(p:number){return Object.values(vectors).map(d=>p+d).filter(q=>walkable(q)&&distance(p,q)===1)}
const spawn=15*WIDTH+10, homes=[9*WIDTH+9,9*WIDTH+10,9*WIDTH+11,10*WIDTH+10]
export type Ghost={pos:number;previous:number;before:number;color:string;wait:number}
export class PacmanGame {
  pos=spawn;previous=spawn;direction:Direction='left';pending:Direction='left';ghosts:Ghost[]=[]
  pellets=new Set<number>();powers=new Set<number>();score=0;lives=3;tick=0;power=0;combo=0;state:'playing'|'won'|'lost'='playing'
  route:number[]=[];expanded=0;message='Ready';ai=true
  constructor(){MAZE.forEach((row,y)=>[...row].forEach((c,x)=>{if(c==='.'||c==='o')this.pellets.add(y*WIDTH+x);if(c==='o')this.powers.add(y*WIDTH+x)}));this.resetActors()}
  resetActors(){this.pos=this.previous=spawn;this.direction=this.pending='left';this.route=[];this.power=0;this.ghosts=['#ed5767','#f4a6d7','#75d1e7','#ffb36b'].map((color,i)=>({pos:homes[i],previous:homes[i],before:homes[i],color,wait:8+i*7}))}
  plan(){
    // Find nearby food, then run A* with a Manhattan heuristic and ghost-risk costs.
    const queue=[this.pos],seen=new Set(queue),candidates:number[]=[]
    for(let i=0;i<queue.length&&candidates.length<16;i++){const p=queue[i];if(this.pellets.has(p))candidates.push(p);for(const q of neighbors(p))if(!seen.has(q)){seen.add(q);queue.push(q)}}
    const danger=(p:number)=>this.power>5?0:this.ghosts.reduce((cost,g)=>g.wait?cost:cost+(distance(p,g.pos)===0?120:distance(p,g.pos)===1?45:distance(p,g.pos)===2?12:0),0)
    candidates.sort((a,b)=>distance(this.pos,a)+danger(a)-(this.powers.has(a)?4:0)-distance(this.pos,b)-danger(b)+(this.powers.has(b)?4:0))
    const goal=candidates[0];if(goal===undefined){this.route=[];return}
    const open=[this.pos],g=new Map([[this.pos,0]]),parent=new Map<number,number>(),closed=new Set<number>()
    while(open.length){open.sort((a,b)=>g.get(a)!+distance(a,goal)-g.get(b)!-distance(b,goal));const p=open.shift()!;if(p===goal){const route=[p];let q=p;while(parent.has(q)){q=parent.get(q)!;route.unshift(q)}this.route=route;this.expanded=closed.size;return}closed.add(p)
      for(const q of neighbors(p)){if(closed.has(q))continue;const cost=g.get(p)!+1+danger(q);if(cost<(g.get(q)??Infinity)){g.set(q,cost);parent.set(q,p);if(!open.includes(q))open.push(q)}}
    }this.route=[]
  }
  moveGhost(g:Ghost,index:number){
    if(g.wait){g.wait--;return}
    const corners=[WIDTH+1,2*WIDTH-2,19*WIDTH+1,20*WIDTH-2]
    let target=this.pos
    if(index===1){const ahead=this.pos+vectors[this.direction]*3;if(walkable(ahead))target=ahead}
    if(index===2&&this.tick%28<10)target=corners[index]
    if(index===3&&distance(g.pos,this.pos)<6)target=corners[index]
    // Exact distance through corridors keeps ghosts from walking through walls.
    const d=new Map([[target,0]]),queue=[target]
    for(let i=0;i<queue.length;i++)for(const q of neighbors(queue[i]))if(!d.has(q)){d.set(q,d.get(queue[i])!+1);queue.push(q)}
    let moves=neighbors(g.pos);if(moves.length>1)moves=moves.filter(p=>p!==g.previous)
    moves.sort((a,b)=>this.power>0?distance(b,this.pos)-distance(a,this.pos):(d.get(a)??999)-(d.get(b)??999))
    if(moves.length){g.previous=g.pos;g.pos=moves[0]}
  }
  collide(){for(let i=0;i<this.ghosts.length;i++){const g=this.ghosts[i];if(g.wait||g.pos!==this.pos&&!(g.before===this.pos&&g.pos===this.previous))continue
    if(this.power){this.score+=200*2**Math.min(this.combo++,3);g.pos=g.previous=homes[i];g.wait=20;this.message='Ghost caught!'}
    else{this.lives--;this.message=this.lives?'Caught! Ready for another life.':'Game over. Restart to try again.';if(!this.lives)this.state='lost';this.resetActors();return true}
  }return false}
  step(){if(this.state!=='playing')return;this.tick++;this.power=Math.max(0,this.power-1);this.previous=this.pos;this.ghosts.forEach(g=>g.before=g.pos);this.message=''
    if(this.ai){this.plan();const q=this.route[1];if(q!==undefined){this.direction=(Object.keys(vectors) as Direction[]).find(d=>this.pos+vectors[d]===q)!;this.pos=q}}
    else {const next=this.pos+vectors[this.pending];if(walkable(next)&&distance(this.pos,next)===1)this.direction=this.pending;const q=this.pos+vectors[this.direction];if(walkable(q)&&distance(this.pos,q)===1)this.pos=q;this.route=[]}
    if(this.pellets.delete(this.pos)){const power=this.powers.delete(this.pos);this.score+=power?50:10;if(power){this.power=65;this.combo=0;this.message='Power pellet! Ghosts can be caught.'}}
    if(!this.pellets.size){this.state='won';this.message='Maze cleared!';return}
    if(this.collide())return
    if(this.tick%2===0)for(let i=0;i<this.ghosts.length;i++)this.moveGhost(this.ghosts[i],i)
    if(this.collide())return
    if(!this.pellets.size){this.state='won';this.message='Maze cleared!'}
  }
}
