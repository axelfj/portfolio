import assert from 'node:assert/strict'
import {mkdtempSync,readFileSync,writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {pathToFileURL} from 'node:url'
import ts from 'typescript'

const dir=mkdtempSync(join(tmpdir(),'portfolio-demo-tests-'))
for(const name of ['algorithms','boards','evolution','poison']){
  const source=readFileSync(new URL(`../src/lib/demos/${name}.ts`,import.meta.url),'utf8')
  const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText.replace(/from ['"]\.\/evolution['"]/g,"from './evolution.mjs'")
  writeFileSync(join(dir,name+'.mjs'),js)
}
const load=name=>import(pathToFileURL(join(dir,name+'.mjs')).href)
const a=await load('algorithms'),b=await load('boards'),e=await load('evolution'),p=await load('poison')
let total=0
function test(name,fn){fn();total++;console.log('PASS '+name)}
test('Sort traces preserve inputs and finish correctly for empty, sorted, reverse and duplicate values',()=>{
  for(const kind of ['quick','heap','bubble'])for(const values of [[],[1],[5,4,3,2,1],[1,2,3,4],[3,1,3,0,-2,1]]){const input=[...values],frames=a.sorting(values,kind);assert.deepEqual(values,input);assert.deepEqual(frames.at(-1).values,[...values].sort((x,y)=>x-y));for(const f of frames)assert.deepEqual([...f.values].sort((x,y)=>x-y),[...values].sort((x,y)=>x-y))}
})
test('Dijkstra and Floyd agree with independent repeated edge relaxation, including disconnected nodes',()=>{
  const rng=e.random(9)
  for(let trial=0;trial<20;trial++){const edges=a.graphEdges.map(edge=>({...edge,w:1+Math.floor(rng()*30)}));if(trial===0)edges.splice(0,edges.length)
    const matrix=a.floyd(edges).at(-1).matrix
    for(let source=0;source<6;source++){const d=Array(6).fill(Infinity);d[source]=0;for(let k=0;k<5;k++)for(const {a:u,b:v,w}of edges){d[v]=Math.min(d[v],d[u]+w);d[u]=Math.min(d[u],d[v]+w)}assert.deepEqual(a.dijkstra(edges,source).at(-1).dist,d);assert.deepEqual(matrix[source],d)}
  }
})
test('A* returns an adjacent, obstacle-free shortest route and terminates for blocked mazes',()=>{
  const walls=a.defaultMaze(),frames=a.astar(walls,18,270),path=frames.at(-1).path
  assert.equal(path[0],18);assert.equal(path.at(-1),270)
  path.forEach((v,i)=>{assert.equal(walls[v],false);if(i)assert.equal(Math.abs(v%17-path[i-1]%17)+Math.abs(Math.floor(v/17)-Math.floor(path[i-1]/17)),1)})
  const queue=[[18,0]],seen=new Set([18]);let distance
  while(queue.length){const [u,d]=queue.shift();if(u===270){distance=d;break}for(const v of [u-17,u+17,u-1,u+1])if(v>=0&&v<289&&!walls[v]&&!seen.has(v)&&Math.abs(v%17-u%17)+Math.abs(Math.floor(v/17)-Math.floor(u/17))===1){seen.add(v);queue.push([v,d+1])}}
  assert.equal(path.length-1,distance);const blocked=Array(289).fill(true);blocked[18]=blocked[270]=false;assert.deepEqual(a.astar(blocked,18,270).at(-1).path,[])
})
test('Minimax cannot lose against any legal human continuation, with either player starting',()=>{
  const walk=(board,turn)=>{const win=b.winner(board);if(win){assert.notEqual(win,1);return}if(turn===1){board.forEach((v,i)=>{if(!v){const next=[...board];next[i]=1;walk(next,2)}})}else{const scores=b.ticScores(board),best=Math.max(...scores.filter(v=>v!==null)),i=scores.indexOf(best),next=[...board];next[i]=2;walk(next,1)}}
  walk(Array(9).fill(0),1);walk(Array(9).fill(0),2)
})
test('Jungle river jumps, water capture boundaries, traps, dens and rat/elephant exceptions',()=>{
  const piece=(rank,x,y,side=1,id=0)=>({rank,x,y,side,id}),has=(m,x,y)=>m.some(p=>p.x===x&&p.y===y)
  let lion=piece(7,0,4);assert(has(b.jungleMoves(lion,[lion]),3,4));assert(!has(b.jungleMoves(lion,[lion,piece(1,1,4,2,1)]),3,4))
  const elephant=piece(8,0,2),rat=piece(1,0,3,2,1);assert(!has(b.jungleMoves(elephant,[elephant,rat]),0,3));assert(has(b.jungleMoves(rat,[elephant,rat]),0,2))
  const swimmer=piece(1,1,3),land=piece(1,0,3,2,1);assert(!has(b.jungleMoves(swimmer,[swimmer,land]),0,3));const cat=piece(2,2,1),trapped=piece(8,2,0,2,1);assert(has(b.jungleMoves(cat,[cat,trapped]),2,0))
  const nearDen=piece(4,3,1);assert(!has(b.jungleMoves(nearDen,[nearDen]),3,0));assert(has(b.jungleMoves({...nearDen,side:2},[{...nearDen,side:2}]),3,0));assert.equal(b.jungleInitial().length,16)
})
test('Battlefield ranges are bounded and units cannot move through occupied squares',()=>{
  const c={id:0,side:1,kind:'Cavalry',x:0,y:0,hp:25,acted:false},block={id:1,side:1,kind:'Archer',x:1,y:0,hp:15,acted:false},enemy={id:2,side:2,kind:'Spearman',x:0,y:1,hp:20,acted:false};const targets=b.battleTargets(c,[c,block,enemy]);assert(!targets.some(t=>!t.attack));assert(targets.some(t=>t.attack&&t.x===0&&t.y===1));assert.deepEqual(b.battleTargets({...c,acted:true},[c]),[])
})
test('Evolution is deterministic, bounded, and preserves best fitness through elitism',()=>{
  const one=new e.Evolution(9),two=new e.Evolution(9)
  for(let i=0;i<4000;i++){one.step(1/30);two.step(1/30)}assert.deepEqual(one.cars,two.cars);assert(one.generation>3);assert(one.best>200, "cars must make meaningful forward progress");assert(new Set(one.history.map(v=>Math.round(v))).size>1, "evolution must change achieved fitness")
  for(let i=1;i<one.history.length;i++)assert(one.history[i]>=one.history[i-1]-.001)
  for(const c of one.cars){assert(Number.isFinite(c.x));assert(c.x>=20&&c.x<=4000);assert(c.dna.grip>=.1&&c.dna.grip<=1)}assert.equal(one.cars.length,24)
})
test('Poison validates suits, exact 13, overflow capture, last-heart exception',()=>{
  const s=p.poisonInitial(2),spade={id:0,suit:0,rank:1},ten={id:9,suit:0,rank:10},two={id:1,suit:0,rank:2},heart={id:39,suit:3,rank:1};s.hands[0]=[ten,two,spade];s.hands[1]=[heart];s.piles=[[{id:2,suit:0,rank:3}],[],[]];assert(!p.poisonLegal(s,ten,1));assert(p.poisonPlay(s,ten.id,0));assert.equal(s.piles[0].reduce((n,c)=>n+p.cardValue(c),0),13);assert.equal(s.won[0].length,0);s.turn=0;assert(p.poisonPlay(s,two.id,0));assert.equal(s.piles[0].length,0);assert.equal(s.won[0].length,3);assert.equal(p.poisonPlay(s,999,0),false)
  const t=p.poisonInitial(2);t.hands[0]=[heart,{id:40,suit:3,rank:2}];t.piles=[[],[],[]];assert(!p.poisonLegal(t,heart,0));t.hands[0]=[heart];assert(p.poisonLegal(t,heart,0))
})
test('Poison completes seeded games for 2–6 players while conserving the deck every move',()=>{
  for(let n=2;n<=6;n++)for(let seed=1;seed<=8;seed++){const s=p.poisonInitial(n,seed);let turns=0;while(!s.finished&&turns++<1200){if(s.roundOver){p.poisonNext(s,seed);continue}const moves=s.hands[s.turn].flatMap(c=>[0,1,2].filter(i=>p.poisonLegal(s,c,i)).map(i=>[c.id,i]));assert(moves.length,`no move at ${n} players, seed ${seed}`);const move=moves[(turns*7)%moves.length];p.poisonPlay(s,...move);const cards=[...s.deck,...s.hands.flat(),...s.piles.flat(),...s.won.flat()];assert.equal(cards.length,52);assert.equal(new Set(cards.map(c=>c.id)).size,52)}assert(s.finished,`game did not terminate: ${n}, ${seed}`)}
})
console.log(`${total} demo checks passed`)
