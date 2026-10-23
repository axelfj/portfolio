import {mountPacman} from './pacman-view'
import {sorting,graphEdges,dijkstra,floyd} from '../lib/demos/algorithms'
import {winner,ticScores,jungleInitial,jungleMoves,animals,water,trap,den,units,battleTargets,type Soldier} from '../lib/demos/boards'
import {Evolution,ground} from '../lib/demos/evolution'
import {poisonInitial,poisonLegal,poisonPlay,poisonNext,cardLabel,cardValue,type PoisonState} from '../lib/demos/poison'

const root=document.querySelector<HTMLElement>('[data-demo]')
if(root){
const controls=document.querySelector<HTMLElement>('#demo-controls')!,details=document.querySelector<HTMLElement>('#demo-details')!,status=document.querySelector<HTMLElement>('#demo-status')!,board=document.querySelector<HTMLElement>('#demo-board')!,canvas=document.querySelector<HTMLCanvasElement>('#demo-canvas'),ctx=canvas?.getContext('2d')
const disposers:(()=>void)[]=[]
function button(label:string,fn:()=>void,parent=controls){const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',fn);parent.append(b);return b}
function select(label:string,options:[string,string][],fn:()=>void,parent=controls){const l=document.createElement('label');l.textContent=label+' ';const s=document.createElement('select');s.setAttribute('aria-label',label);options.forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;s.append(o)});s.addEventListener('change',fn);l.append(s);parent.append(l);return s}
function check(label:string,fn:()=>void,parent=controls){const l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.addEventListener('change',fn);l.append(c,document.createTextNode(label));parent.append(l);return c}
function range(label:string,min:number,max:number,value:number,step:number,fn:()=>void){const l=document.createElement('label');l.textContent=label+' ';const r=document.createElement('input');r.type='range';r.min=String(min);r.max=String(max);r.step=String(step);r.value=String(value);l.append(r);controls.append(l);r.addEventListener('input',fn);return r}
function background(){if(!ctx||!canvas)return;ctx.fillStyle='#14171d';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.font='16px Atkinson, sans-serif';ctx.textAlign='left'}
function table(headers:string[],rows:string[][]){return '<table class="lab-table"><thead><tr>'+headers.map(x=>'<th scope="col">'+x+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('')+'</tbody></table>'}
function cell(parent:HTMLElement,text:string,label:string,fn:()=>void,cls=''){const b=button(text,fn,parent);b.className='board-cell '+cls;b.setAttribute('aria-label',label);return b}
// A single bounded timer per demo. Nothing runs until the visitor presses Play.
function transport(next:()=>boolean,reset:()=>void){let timer:ReturnType<typeof setInterval>|undefined;const play=button('Play',()=>{if(timer)pause();else{play.textContent='Pause';timer=setInterval(()=>{if(!next())pause()},Number(speed.value))}});const pause=()=>{if(timer)clearInterval(timer);timer=undefined;play.textContent='Play'};const step=button('Step',()=>{pause();next()});button('Reset',()=>{pause();reset()});const speed=select('Pace',[['300','Normal'],['80','Fast'],['700','Slow']],()=>{pause()});const stop=()=>pause();document.addEventListener('visibilitychange',stop);disposers.push(()=>{pause();document.removeEventListener('visibilitychange',stop)});return {pause,step,play}}

if(root.dataset.demo==='sorting'){
  let data=[47,18,66,29,82,11,54,36,73,23,91,42,8,61,32,77],index=0,frames=sorting(data,'quick')
  const kind=select('Algorithm',[['quick','Quicksort'],['heap','Heapsort'],['bubble','Bubble sort']],()=>reset())
  const dataset=select('Data',[['mixed','Mixed'],['reverse','Reversed'],['sorted','Sorted'],['duplicates','Duplicates']],()=>{data=dataset.value==='reverse'?Array.from({length:16},(_,i)=>96-i*5):dataset.value==='sorted'?Array.from({length:16},(_,i)=>10+i*5):dataset.value==='duplicates'?Array.from({length:16},(_,i)=>[40,20,60,40][i%4]):[47,18,66,29,82,11,54,36,73,23,91,42,8,61,32,77];reset()})
  const t=transport(()=>{if(index>=frames.length-1)return false;index++;draw();return index<frames.length-1},()=>{index=0;draw()})
  button('Back',()=>{t.pause();index=Math.max(0,index-1);draw()})
  function reset(){t.pause();frames=sorting(data,kind.value);index=0;draw()}
  function draw(){if(!ctx)return;background();const f=frames[index],w=780/f.values.length;f.values.forEach((v,i)=>{ctx.fillStyle=f.active.includes(i)?'#9ab7e8':'#8894a6';const h=v*3.2;ctx.fillRect(60+i*w,390-h,w-8,h);ctx.fillStyle='#edf0f5';ctx.textAlign='center';ctx.fillText(String(v),60+i*w+(w-8)/2,415)});status.textContent=`${kind.options[kind.selectedIndex].text} · Step ${index+1}/${frames.length} · ${f.note} · ${f.comparisons} comparisons · ${f.swaps} swaps`;details.textContent='Current order: '+f.values.join(', ')}draw()
}

if(root.dataset.demo==='graphs'){
  let edges=graphEdges.map(e=>({...e})),index=0,df=dijkstra(edges,0),ff=floyd(edges)
  const mode=select('Algorithm',[['dijkstra','Dijkstra'],['floyd','Floyd–Warshall']],()=>reset()),source=select('Source',Array.from({length:6},(_,i)=>[String(i),String.fromCharCode(65+i)] as [string,string]),()=>reset()),target=select('Target',Array.from({length:6},(_,i)=>[String(i),String.fromCharCode(65+i)] as [string,string]),()=>draw());target.value='5'
  const t=transport(()=>{if(index>=length()-1)return false;index++;draw();return index<length()-1},()=>{index=0;draw()});button('Back',()=>{t.pause();index=Math.max(0,index-1);draw()})
  const editor=document.createElement('div');editor.className='edge-inputs';details.append(editor);const result=document.createElement('div');details.prepend(result)
  edges.forEach(e=>{const l=document.createElement('label');l.textContent=`${String.fromCharCode(65+e.a)}–${String.fromCharCode(65+e.b)} `;const input=document.createElement('input');input.type='number';input.min='1';input.max='30';input.value=String(e.w);input.setAttribute('aria-label',l.textContent+'weight');input.addEventListener('change',()=>{e.w=Math.max(1,Math.min(30,Math.round(Number(input.value)||1)));input.value=String(e.w);reset()});l.append(input);editor.append(l)})
  function length(){return mode.value==='dijkstra'?df.length:ff.length}
  function reset(){t.pause();df=dijkstra(edges,Number(source.value));ff=floyd(edges);index=0;draw()}
  function draw(){if(!ctx)return;background();const pts=[[90,220],[300,80],[300,340],[550,100],[550,340],[800,220]],d=df[Math.min(index,df.length-1)],f=ff[Math.min(index,ff.length-1)],path:number[]=[];source.disabled=mode.value==='floyd';target.disabled=mode.value==='floyd'
    if(mode.value==='dijkstra'&&Number.isFinite(d.dist[Number(target.value)])){let u=Number(target.value);while(u!==-1){path.unshift(u);u=d.prev[u]}}
    for(const e of edges){const a=pts[e.a],b=pts[e.b],onPath=path.some((p,i)=>i>0&&(path[i-1]===e.a&&p===e.b||path[i-1]===e.b&&p===e.a));ctx.strokeStyle=onPath?'#f6d66f':mode.value==='dijkstra'&&d.edge===e?'#9ab7e8':'#6d788a';ctx.lineWidth=onPath?5:2;ctx.beginPath();ctx.moveTo(...a as [number,number]);ctx.lineTo(...b as [number,number]);ctx.stroke();const x=(a[0]+b[0])/2,y=(a[1]+b[1])/2;ctx.fillStyle='#14171d';ctx.fillRect(x-14,y-15,28,26);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(String(e.w),x,y+4)}
    pts.forEach(([x,y],i)=>{ctx.fillStyle=(mode.value==='dijkstra'?d.visited.includes(i):f.k===i)?'#9ab7e8':'#e3e7ee';ctx.beginPath();ctx.arc(x,y,26,0,Math.PI*2);ctx.fill();ctx.fillStyle='#14171d';ctx.textAlign='center';ctx.fillText(String.fromCharCode(65+i),x,y+5);if(mode.value==='dijkstra'){ctx.fillStyle='#e3e7ee';ctx.fillText(Number.isFinite(d.dist[i])?String(d.dist[i]):'∞',x,y+53)}})
    status.textContent=`Step ${index+1}/${length()} · ${mode.value==='dijkstra'?d.note:f.note}`
    result.innerHTML=mode.value==='dijkstra'?table(['Node','Distance','Previous'],d.dist.map((v,i)=>[String.fromCharCode(65+i),Number.isFinite(v)?String(v):'∞',d.prev[i]<0?'—':String.fromCharCode(65+d.prev[i])]))+`<p>Current route: ${path.map(i=>String.fromCharCode(65+i)).join(' → ')||'Not reached'}. Yellow edges show the current route; its distance is final when the target is settled.</p>`:table(['From / To','A','B','C','D','E','F'],f.matrix.map((row,i)=>[String.fromCharCode(65+i),...row.map((v,j)=>`<span class="${i===f.i&&j===f.j?'changed':''}">${Number.isFinite(v)?v:'∞'}</span>`)]))
  }draw()
}

if(root.dataset.demo==='pacman'&&canvas){disposers.push(mountPacman(canvas,controls,details,status))}

if(root.dataset.demo==='evolving-car'){
  let seed=42,world=new Evolution(seed),playing=false,animation=0,last=0,accumulated=0,lastReport=-1
  const pause=()=>{playing=false;cancelAnimationFrame(animation);last=0;play.textContent='Play'}
  const play=button('Play',()=>{if(playing){pause();lastReport=-1;draw();return}playing=true;play.textContent='Pause';animation=requestAnimationFrame(tick)})
  button('Step',()=>{pause();for(let i=0;i<60;i++)world.step(1/60);lastReport=-1;draw()})
  button('Reset',()=>{pause();world=new Evolution(seed);world.mutation=Number(mutation.value);lastReport=-1;accumulated=0;draw()})
  const pace=select('Speed',[['2','2×'],['8','8×'],['1','1×']],()=>{})
  const mutation=range('Mutation',0,.5,.15,.01,()=>{world.mutation=Number(mutation.value);lastReport=-1;draw()})
  button('New seed',()=>{pause();seed++;world=new Evolution(seed);world.mutation=Number(mutation.value);lastReport=-1;accumulated=0;draw()})
  button('Next generation',()=>{pause();const g=world.generation;for(let i=0;i<1400&&world.generation===g;i++)world.step(1/60);lastReport=-1;draw()})
  function tick(now:number){if(!playing)return;accumulated+=Math.min((now-(last||now))/1000,.1)*Number(pace.value);last=now;while(accumulated>=1/60){world.step(1/60);accumulated-=1/60}draw();if(world.generation>80){pause();return}animation=requestAnimationFrame(tick)}
  const stop=()=>{pause();lastReport=-1;draw()};document.addEventListener('visibilitychange',stop);disposers.push(()=>{pause();document.removeEventListener('visibilitychange',stop)})
  function draw(){if(!ctx)return;background();const leader=[...world.cars].sort((a,b)=>b.x-a.x)[0],camera=Math.max(0,leader.x-220)
    ctx.fillStyle='#343b45';ctx.beginPath();ctx.moveTo(0,390);for(let x=0;x<=900;x+=4)ctx.lineTo(x,ground(x+camera));ctx.lineTo(900,390);ctx.closePath();ctx.fill();ctx.strokeStyle='#99a8bf';ctx.lineWidth=2;ctx.stroke()
    world.cars.forEach(c=>{const x=c.x-camera,d=c.dna,y=ground(c.x)-d.wheel;ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan((ground(c.x+2)-ground(c.x-2))/4));ctx.globalAlpha=c===leader?1:.32;ctx.strokeStyle=c===leader?'#ffda71':'#88c8df';ctx.fillStyle=ctx.strokeStyle;ctx.fillRect(-d.body/2,-d.wheel*.9,d.body,13);for(const wx of [-d.body*.35,d.body*.35]){ctx.beginPath();ctx.arc(wx,0,d.wheel,0,Math.PI*2);ctx.stroke()}ctx.restore()})
    ctx.fillStyle='#edf0f5';ctx.fillText(`Generation ${world.generation}`,24,32);ctx.fillText(`Seed ${seed} · Mutation ${Math.round(world.mutation*100)}%`,24,58);ctx.fillText(`Best distance ${Math.round(world.best-20)} / 3980`,24,84)
    const h=world.history;ctx.strokeStyle='#ffda71';ctx.beginPath();h.forEach((v,i)=>{const x=470+i*400/80,y=130-(v-20)/3980*95;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();ctx.fillText('Best fitness per generation',470,155)
    const report=world.generation*100+Math.floor(world.time*2);if(lastReport===report)return;lastReport=report
    status.textContent=`Generation ${world.generation} · ${world.time.toFixed(1)} / 22 seconds · ${world.cars.filter(c=>c.alive).length} active cars · Best ever ${Math.round(world.best-20)} · ${playing?"Running":"Paused"}`
    details.innerHTML=table(['Leader traits','Value'],[['Wheel radius',leader.dna.wheel.toFixed(1)],['Power',leader.dna.power.toFixed(2)],['Grip',leader.dna.grip.toFixed(2)],['Body mass parameter',leader.dna.body.toFixed(1)]])+`<p>Fitness history (distance): ${h.length?h.map(v=>Math.round(v-20)).join(', '):'Run a generation to collect data.'}</p>`
  }draw()
}

if(root.dataset.demo==='tic-tac-toe'){
  let b=Array(9).fill(0),show=false
  const first=select('Starts',[['human','You (X)'],['computer','Computer (O)']],()=>reset())
  check('Show minimax scores',()=>{show=!show;draw()});button('New game',()=>reset())
  function ai(){if(winner(b))return;const scores=ticScores(b);let best=-2,move=-1;for(const i of [4,0,2,6,8,1,3,5,7])if(scores[i]!==null&&scores[i]!>best){best=scores[i]!;move=i}if(move>=0)b[move]=2}
  function reset(){b=Array(9).fill(0);if(first.value==='computer')ai();draw()}
  function draw(){board.innerHTML='';const grid=document.createElement('div');grid.className='board-grid tic-board';board.append(grid);const w=winner(b),scores=show?ticScores(b):[]
    b.forEach((v,i)=>{const text=v===1?'X':v===2?'O':'';const btn=cell(grid,text,`Row ${Math.floor(i/3)+1}, column ${i%3+1}: ${text||'empty'}`,()=>{if(b[i]||winner(b))return;b[i]=1;ai();draw()},v===1?'side1':v===2?'side2':'');btn.disabled=!!v||!!w;if(!v&&show){const s=document.createElement('small');s.textContent=`O: ${scores[i]!>0?'+':''}${scores[i]}`;btn.append(s)}});status.textContent=w===3?'Draw. Neither player can force another move.':w===1?'You win.':w===2?'Computer wins.':'Your turn: place X in an empty square.';details.textContent=show?'Forecast scores evaluate O moving next at each empty square. Minimax explores all remaining legal continuations.':'Enable move scores to inspect the search.'
  }draw()
}

if(root.dataset.demo==='dou-shou-qi'){
  let pieces=jungleInitial(),turn=1,selected=-1,ended='',seen=new Map<string,number>()
  button('New game',()=>{pieces=jungleInitial();turn=1;selected=-1;ended='';seen=new Map();remember();draw()});button('Resign',()=>{if(!ended){ended=`Player ${3-turn} wins by resignation.`;draw()}})
  function remember(){const key=turn+':'+[...pieces].sort((a,b)=>a.id-b.id).map(p=>`${p.id},${p.x},${p.y}`).join(';');const n=(seen.get(key)||0)+1;seen.set(key,n);if(n>=3)ended='Draw: the same position occurred three times.'}
  function choose(x:number,y:number){if(ended)return;const current=pieces.find(p=>p.id===selected),at=pieces.find(p=>p.x===x&&p.y===y)
    if(at?.side===turn){selected=at.id;draw();return}
    if(current&&jungleMoves(current,pieces).some(m=>m.x===x&&m.y===y)){pieces=pieces.filter(p=>p.x!==x||p.y!==y);current.x=x;current.y=y;if(den(x,y)===3-turn||!pieces.some(p=>p.side===3-turn))ended=`Player ${turn} wins.`;turn=3-turn;selected=-1;if(!ended&&!pieces.some(p=>p.side===turn&&jungleMoves(p,pieces).length))ended=`Player ${3-turn} wins: no legal moves.`;remember();draw()}
  }
  function draw(){board.innerHTML='';const grid=document.createElement('div');grid.className='board-grid';grid.style.gridTemplateColumns='repeat(7,1fr)';board.append(grid);const p=pieces.find(p=>p.id===selected),moves=p?jungleMoves(p,pieces):[]
    for(let y=0;y<9;y++)for(let x=0;x<7;x++){const at=pieces.find(p=>p.x===x&&p.y===y),terrain=water(x,y)?'water':den(x,y)?'den':trap(x,y)?'trap':'',legal=moves.some(m=>m.x===x&&m.y===y);const label=at?`${animals[at.rank]} ${at.rank}`:terrain==='den'?'Den':terrain==='trap'?'Trap':terrain==='water'?'≈':'';const c=cell(grid,label,`Row ${y+1}, column ${x+1}: ${at?'Player '+at.side+' ':''}${label||'land'}${legal?', legal destination':''}`,()=>choose(x,y),`${terrain} ${at?'side'+at.side:''} ${at?.id===selected?'selected':''} ${legal?'legal':''}`);if(ended)c.disabled=true}
    status.textContent=ended||`Player ${turn} to move. ${p?animals[p.rank]+' selected · '+moves.length+' legal destinations.':'Select a friendly animal.'}`;details.textContent='Blue: Player 1 · Red: Player 2 · Ranks: Rat 1, Cat 2, Wolf 3, Dog 4, Leopard 5, Tiger 6, Lion 7, Elephant 8. Each animal moves one square orthogonally unless jumping a river.'
  }remember();draw()
}

if(root.dataset.demo==='battlefield'){
  let army:Soldier[]=[],budget=[0,12,12],turn=1,drafting=true,selected=-1,ended='',id=0
  const recruitment=document.createElement('div');recruitment.className='demo-controls';controls.append(recruitment);details.innerHTML=table(['Unit','Cost','HP','Attack','Defense','Range','Move'],Object.entries(units).map(([name,u])=>[name,...[u.cost,u.hp,u.attack,u.defense,u.range,u.move].map(String)]))
  Object.keys(units).forEach(kind=>button(`${kind} (${units[kind].cost})`,()=>{if(!drafting||budget[turn]<units[kind].cost||army.filter(s=>s.side===turn).length>=8)return;const x=army.filter(s=>s.side===turn).length;army.push({id:id++,kind,side:turn,x,y:turn===1?0:7,hp:units[kind].hp,acted:false});budget[turn]-=units[kind].cost;draw()},recruitment))
  const ready=button('Ready',()=>{if(!drafting||!army.some(p=>p.side===turn))return;if(turn===1)turn=2;else{drafting=false;turn=1}draw()})
  const end=button('End turn',()=>{if(drafting||ended)return;turn=3-turn;army.forEach(p=>p.acted=false);selected=-1;draw()})
  button('Reset armies',()=>{army=[];budget=[0,12,12];turn=1;drafting=true;selected=-1;ended='';id=0;draw()})
  function choose(x:number,y:number){if(drafting||ended)return;const p=army.find(a=>a.id===selected),at=army.find(a=>a.x===x&&a.y===y);if(at?.side===turn&&!at.acted){selected=at.id;draw();return}if(!p)return;const move=battleTargets(p,army).find(m=>m.x===x&&m.y===y);if(!move)return
    if(move.attack&&at){at.hp-=Math.max(1,units[p.kind].attack-units[at.kind].defense);if(at.hp<=0)army=army.filter(a=>a.id!==at.id)}else{p.x=x;p.y=y}p.acted=true;selected=-1;if(!army.some(a=>a.side===3-turn))ended=`Player ${turn} wins.`;draw()}
  function draw(){board.innerHTML='';const grid=document.createElement('div');grid.className='board-grid';grid.style.gridTemplateColumns='repeat(8,1fr)';board.append(grid);const p=army.find(a=>a.id===selected),moves=p?battleTargets(p,army):[];for(let y=0;y<8;y++)for(let x=0;x<8;x++){const at=army.find(a=>a.x===x&&a.y===y),m=moves.find(a=>a.x===x&&a.y===y);const c=cell(grid,at?units[at.kind].symbol:'',`Row ${y+1}, column ${x+1}: ${at?`Player ${at.side} ${at.kind}, ${at.hp} HP${at.acted?', acted':''}`:'empty'}${m?', legal '+(m.attack?'attack':'move'):''}`,()=>choose(x,y),`${at?'side'+at.side:''} ${at?.id===selected?'selected':''} ${m?m.attack?'attack':'legal':''}`);if(at){const s=document.createElement('small');s.textContent=at.hp+' HP'+(at.acted?' ✓':'');c.append(s)}c.disabled=drafting||!!ended}recruitment.hidden=!drafting;ready.hidden=!drafting;end.disabled=drafting||!!ended;status.textContent=ended||(drafting?`Player ${turn}: recruit an army · ${budget[turn]} budget remaining. Press Ready when finished.`:`Player ${turn} to act. ${p?p.kind+' selected.':'Select a unit or end your turn.'}`)
  }draw()
}

if(root.dataset.demo==='poison'){
  let state=poisonInitial(),past:PoisonState[]=[],future:PoisonState[]=[],selected=-1
  const count=select('Players',[2,3,4,5,6].map(n=>[String(n),String(n)] as [string,string]),()=>reset())
  const undo=button('Undo',()=>{if(!past.length)return;future.push(structuredClone(state));state=past.pop()!;selected=-1;draw()}),redo=button('Redo',()=>{if(!future.length)return;past.push(structuredClone(state));state=future.pop()!;selected=-1;draw()});button('Reset game',()=>reset())
  const next=button('Next round',()=>{if(poisonNext(state)){past=[];future=[];selected=-1;draw()}})
  function reset(){state=poisonInitial(Number(count.value));past=[];future=[];selected=-1;draw()}
  function draw(){board.innerHTML='';const surface=document.createElement('div');surface.className='poison-table';board.append(surface);const cauldrons=document.createElement('div');cauldrons.className='cauldrons';surface.append(cauldrons);const c=state.hands[state.turn].find(c=>c.id===selected)
    state.piles.forEach((pile,i)=>{const legal=!!c&&poisonLegal(state,c,i),b=button('',()=>{if(!c||!legal)return;past.push(structuredClone(state));if(poisonPlay(state,c.id,i)){future=[];selected=-1;draw()}},cauldrons);b.className='cauldron'+(legal?' legal':'');b.disabled=!legal;const name=document.createElement('strong');name.textContent=`Cauldron ${i+1} · ${pile.reduce((n,c)=>n+cardValue(c),0)} / 13`;const contents=document.createElement('span');contents.textContent=pile.map(cardLabel).join(' ')||'Empty';b.append(name,contents)})
    const title=document.createElement('p');title.textContent=`Player ${state.turn+1}'s hand`;surface.append(title);const hand=document.createElement('div');hand.className='poison-hand';surface.append(hand);state.hands[state.turn].forEach(c=>{const b=button(cardLabel(c),()=>{selected=c.id;draw()},hand);b.className='playing-card'+(c.suit===3||c.suit===2?' red':'')+(selected===c.id?' selected':'');b.setAttribute('aria-pressed',String(selected===c.id));b.disabled=state.roundOver})
    status.textContent=`Round ${state.round} · ${state.roundOver?'Round complete':`Player ${state.turn+1}'s turn`} · ${state.log}`;details.innerHTML=table(['Player','Hand','Captured hearts this round','Total penalties','Status'],state.hands.map((h,i)=>[String(i+1),String(h.length),String(state.won[i].filter(c=>c.suit===3).length),String(state.scores[i]),state.escaped.includes(i)?'Escaped':state.active.includes(i)?'Playing':'Finished']))+`<p>Deck: ${state.deck.length} cards. Undo stack: ${past.length} · Redo stack: ${future.length}. Hearts in hands do not count as captured poison.</p>`;undo.disabled=!past.length;redo.disabled=!future.length;next.hidden=!state.roundOver||state.finished
  }draw()
}
const cleanup=()=>disposers.forEach(fn=>fn());window.addEventListener('pagehide',cleanup,{once:true});document.addEventListener('astro:before-swap',cleanup,{once:true})
}
