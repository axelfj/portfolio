export type SortFrame = { values: number[]; active: number[]; comparisons: number; swaps: number; note: string }
export function sorting(input: number[], kind: string): SortFrame[] {
  const a = [...input], frames: SortFrame[] = []; let comparisons = 0, swaps = 0
  const snap = (active: number[], note: string) => frames.push({ values: [...a], active, comparisons, swaps, note })
  const compare = (i: number, j: number) => { comparisons++; snap([i,j], `Compare positions ${i+1} and ${j+1}`); return a[i]-a[j] }
  const swap = (i: number, j: number) => { if (i === j) return; [a[i],a[j]]=[a[j],a[i]]; swaps++; snap([i,j], 'Swap these values') }
  snap([], 'Ready')
  if (kind === 'quick') {
    const partition = (lo: number, hi: number) => { if (lo >= hi) return; let i=lo; for(let j=lo;j<hi;j++) if(compare(j,hi)<0) swap(i++,j); swap(i,hi); partition(lo,i-1); partition(i+1,hi) }; partition(0,a.length-1)
  } else if (kind === 'heap') {
    const heap = (n: number,i: number) => { let k=i; const l=2*i+1,r=l+1; if(l<n&&compare(l,k)>0)k=l; if(r<n&&compare(r,k)>0)k=r; if(k!==i){swap(k,i);heap(n,k)} }
    for(let i=Math.floor(a.length/2)-1;i>=0;i--)heap(a.length,i)
    for(let i=a.length-1;i>0;i--){swap(0,i);heap(i,0)}
  } else {
    for(let i=0;i<a.length-1;i++){let changed=false;for(let j=0;j<a.length-i-1;j++)if(compare(j,j+1)>0){swap(j,j+1);changed=true}if(!changed)break}
  }
  snap([], 'Sorted'); return frames
}
export type Edge = { a: number; b: number; w: number }
export const graphEdges: Edge[] = [{a:0,b:1,w:4},{a:0,b:2,w:2},{a:1,b:2,w:1},{a:1,b:3,w:5},{a:2,b:3,w:8},{a:2,b:4,w:10},{a:3,b:4,w:2},{a:3,b:5,w:6},{a:4,b:5,w:3}]
export function dijkstra(edges: Edge[], start: number, n=6) {
  const dist=Array(n).fill(Infinity), prev=Array(n).fill(-1), visited: number[]=[]
  dist[start]=0
  const frames: {dist:number[];visited:number[];prev:number[];edge:Edge|null;note:string}[]=[]
  const save=(edge:Edge|null,note:string)=>frames.push({dist:[...dist],visited:[...visited],prev:[...prev],edge,note})
  save(null,'Start with distance 0 at the source')
  while(visited.length<n){const u=dist.reduce((best,d,i)=>!visited.includes(i)&&d<(best<0?Infinity:dist[best])?i:best,-1);if(u<0)break;visited.push(u);save(null,`Settle ${String.fromCharCode(65+u)} at distance ${dist[u]}`)
    for(const e of edges){const v=e.a===u?e.b:e.b===u?e.a:-1;if(v<0||visited.includes(v))continue;if(dist[u]+e.w<dist[v]){dist[v]=dist[u]+e.w;prev[v]=u;save(e,`Improve ${String.fromCharCode(65+v)} through ${String.fromCharCode(65+u)}`)}}
  }save(null,'Shortest distances found');return frames
}
export function floyd(edges: Edge[], n=6) {
  const d=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j?0:Infinity))
  edges.forEach(e=>{d[e.a][e.b]=e.w;d[e.b][e.a]=e.w})
  const frames:{matrix:number[][];k:number;i:number;j:number;note:string}[]=[]
  const save=(k:number,i:number,j:number,note:string)=>frames.push({matrix:d.map(r=>[...r]),k,i,j,note})
  save(-1,-1,-1,'Initial direct-edge distances')
  for(let k=0;k<n;k++){save(k,-1,-1,`Allow paths through ${String.fromCharCode(65+k)}`);for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(d[i][k]+d[k][j]<d[i][j]){d[i][j]=d[i][k]+d[k][j];save(k,i,j,`${String.fromCharCode(65+i)} → ${String.fromCharCode(65+j)} improves via ${String.fromCharCode(65+k)}`)}}
  save(-1,-1,-1,'All-pairs shortest distances found');return frames
}
export const mazeSize=17
export function defaultMaze() { return Array.from({length:mazeSize*mazeSize},(_,i)=>{const x=i%mazeSize,y=Math.floor(i/mazeSize);return x===0||y===0||x===16||y===16||(x%4===0&&y>2&&y<14&&y!==x/2+3)}) }
export function astar(walls:boolean[],start:number,goal:number) {
  const open=[start],closed:number[]=[],g=Array(walls.length).fill(Infinity),prev=Array(walls.length).fill(-1);g[start]=0
  const h=(i:number)=>Math.abs(i%mazeSize-goal%mazeSize)+Math.abs(Math.floor(i/mazeSize)-Math.floor(goal/mazeSize))
  const frames:{open:number[];closed:number[];current:number;path:number[]}[]=[]
  while(open.length){open.sort((a,b)=>g[a]+h(a)-g[b]-h(b));const u=open.shift()!;closed.push(u)
    if(u===goal){const path:number[]=[];let v=u;while(v!==-1){path.unshift(v);v=prev[v]}frames.push({open:[...open],closed:[...closed],current:u,path});return frames}
    for(const v of [u-1,u+1,u-mazeSize,u+mazeSize]){if(v<0||v>=walls.length||Math.abs(v%mazeSize-u%mazeSize)+Math.abs(Math.floor(v/mazeSize)-Math.floor(u/mazeSize))!==1||walls[v]||closed.includes(v))continue;if(g[u]+1<g[v]){g[v]=g[u]+1;prev[v]=u;if(!open.includes(v))open.push(v)}}
    frames.push({open:[...open],closed:[...closed],current:u,path:[]})
  }return frames
}
