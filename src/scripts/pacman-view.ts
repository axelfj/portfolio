import {PacmanGame,MAZE,WIDTH,distance,type Direction} from '../lib/demos/pacman'

export function mountPacman(canvas:HTMLCanvasElement,controls:HTMLElement,details:HTMLElement,status:HTMLElement){
  const ctx=canvas.getContext('2d')!;let game=new PacmanGame(),playing=false,animation=0,last=0,accumulator=0,lastStep=0,from=game.pos,ghostFrom=game.ghosts.map(g=>g.pos),lifePause=0
  const size=26,ox=27,oy=80
  const button=(label:string,fn:()=>void,parent=controls)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',fn);parent.append(b);return b}
  const pause=()=>{playing=false;cancelAnimationFrame(animation);last=0;play.textContent='Play';render(performance.now());report()}
  const play=button('Play',()=>{if(playing){pause();return}if(game.state!=='playing')return;playing=true;last=0;lastStep=performance.now();play.textContent='Pause';report();animation=requestAnimationFrame(frame)})
  button('Step',()=>{pause();advance();render(performance.now())})
  button('Restart',()=>{pause();game=new PacmanGame();game.ai=mode.value==='ai';from=game.pos;ghostFrom=game.ghosts.map(g=>g.pos);accumulator=0;lifePause=0;render(performance.now());report()})
  const label=document.createElement('label');label.textContent='Control ';const mode=document.createElement('select');mode.setAttribute('aria-label','Control');mode.innerHTML='<option value="ai">Watch AI play</option><option value="human">Play yourself</option>';label.append(mode);controls.append(label)
  const overlayLabel=document.createElement('label'),overlay=document.createElement('input');overlay.type='checkbox';overlayLabel.append(overlay,document.createTextNode('Show AI route'));controls.append(overlayLabel);overlay.addEventListener('change',()=>render(performance.now()))
  const pad=document.createElement('div');pad.className='pac-pad';pad.setAttribute('role','group');pad.setAttribute('aria-label','Movement controls');details.append(pad)
  const turn=(d:Direction)=>{game.pending=d;if(!playing&&game.state==='playing'){advance();render(performance.now())}}
  button('↑',()=>turn('up'),pad).setAttribute('aria-label','Move up');button('←',()=>turn('left'),pad).setAttribute('aria-label','Move left');button('↓',()=>turn('down'),pad).setAttribute('aria-label','Move down');button('→',()=>turn('right'),pad).setAttribute('aria-label','Move right')
  mode.addEventListener('change',()=>{game.ai=mode.value==='ai';pad.hidden=game.ai;report();render(performance.now())});pad.hidden=true
  const help=document.createElement('p');help.className='compact';help.textContent='AI uses A* to collect pellets while assigning a high cost to tiles near ghosts. Turn on the route overlay to inspect its next plan. In manual mode, use arrow keys, WASD, or the direction buttons. Space pauses.';details.append(help)
  function report(){status.textContent=`Score ${game.score} · ${game.lives} lives · ${game.pellets.size} pellets left · ${game.power?`Power ${Math.ceil(game.power*.16)}s · `:''}${game.state==='won'?'Maze cleared!':game.state==='lost'?'Game over':playing?'Playing':'Paused'}${game.message?' · '+game.message:''}`}
  function advance(){from=game.pos;ghostFrom=game.ghosts.map(g=>g.pos);const lives=game.lives;game.step();lastStep=performance.now();if(game.lives<lives)lifePause=1000;report()}
  function frame(now:number){if(!playing)return;const dt=Math.min(now-(last||now),100);last=now
    if(lifePause>0){lifePause-=dt;accumulator=0}else{accumulator+=dt;if(accumulator>=160){advance();accumulator-=160}}
    render(now);if(game.state!=='playing'){pause();return}animation=requestAnimationFrame(frame)
  }
  function position(p:number,previous:number,t:number){if(distance(p,previous)>1)return [ox+(p%WIDTH+.5)*size,oy+(Math.floor(p/WIDTH)+.5)*size];return [ox+((previous%WIDTH)*(1-t)+(p%WIDTH)*t+.5)*size,oy+(Math.floor(previous/WIDTH)*(1-t)+Math.floor(p/WIDTH)*t+.5)*size]}
  function render(now:number){const t=playing?Math.min(1,(now-lastStep)/160):1;ctx.fillStyle='#080b12';ctx.fillRect(0,0,600,670);ctx.textAlign='left';ctx.font='bold 18px Atkinson, sans-serif';ctx.fillStyle='#fff';ctx.fillText('SCORE  '+String(game.score).padStart(5,'0'),27,30);ctx.textAlign='right';ctx.fillText('LIVES  '+game.lives,573,30);ctx.font='12px Atkinson, sans-serif';ctx.fillStyle='#9ab7e8';ctx.fillText(game.ai?'AI / A* SEARCH':'PLAYER CONTROL',573,52)
    // Outline the exposed boundaries rather than painting square wall tiles.
    ctx.strokeStyle='#476fe0';ctx.lineWidth=2;ctx.lineJoin='round';ctx.lineCap='round'
    MAZE.forEach((row,y)=>[...row].forEach((c,x)=>{if(c!=='#')return;const px=ox+x*size,py=oy+y*size;ctx.fillStyle='#101831';ctx.fillRect(px,py,size,size)
      for(const [dx,dy]of [[0,-1],[0,1],[-1,0],[1,0]]){if(y+dy<0||y+dy>=MAZE.length||x+dx<0||x+dx>=WIDTH||MAZE[y+dy][x+dx]==='#')continue;ctx.beginPath();if(dy){ctx.moveTo(px,py+(dy<0?2:size-2));ctx.lineTo(px+size,py+(dy<0?2:size-2))}else{ctx.moveTo(px+(dx<0?2:size-2),py);ctx.lineTo(px+(dx<0?2:size-2),py+size)}ctx.stroke()}
    }))
    for(const p of game.pellets){const [x,y]=position(p,p,1);ctx.fillStyle='#f2e3c5';ctx.beginPath();ctx.arc(x,y,game.powers.has(p)?5.5+Math.sin(now/140)*1.1:2.1,0,Math.PI*2);ctx.fill()}
    if(overlay.checked&&game.ai&&game.route.length){ctx.strokeStyle='#b9cffa88';ctx.lineWidth=2;ctx.beginPath();game.route.forEach((p,i)=>{const [x,y]=position(p,p,1);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()}
    game.ghosts.forEach((g,i)=>{const [x,y]=position(g.pos,ghostFrom[i]??g.pos,t),r=10;ctx.save();ctx.translate(x,y);ctx.globalAlpha=g.wait?.55:1;ctx.fillStyle=game.power?(game.power<16&&Math.floor(now/150)%2?'#eee':'#4465ce'):g.color;ctx.beginPath();ctx.arc(0,-1,r,Math.PI,0);ctx.lineTo(r,r);for(let k=0;k<4;k++)ctx.lineTo(r-k*5-2.5,k%2?r:r-4);ctx.lineTo(-r,r);ctx.closePath();ctx.fill()
      if(game.power){ctx.fillStyle='#fff';ctx.fillRect(-5,-2,2,3);ctx.fillRect(3,-2,2,3);ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-5,5);ctx.lineTo(-2,3);ctx.lineTo(1,5);ctx.lineTo(4,3);ctx.stroke()}else{for(const ex of [-4,4]){ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(ex,-2,3.3,4,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#192b59';ctx.beginPath();ctx.arc(ex+Math.sign(game.pos%WIDTH-g.pos%WIDTH),-2+Math.sign(Math.floor(game.pos/WIDTH)-Math.floor(g.pos/WIDTH)),1.6,0,Math.PI*2);ctx.fill()}}ctx.restore()
    })
    const [x,y]=position(game.pos,from,t),angle={right:0,down:Math.PI/2,left:Math.PI,up:-Math.PI/2}[game.direction],mouth=playing?.12+Math.abs(Math.sin(now/65))*.55:.3;ctx.fillStyle='#ffdc45';ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,10.5,angle+mouth,angle+Math.PI*2-mouth);ctx.closePath();ctx.fill()
    ctx.textAlign='center';ctx.font='13px Atkinson, sans-serif';ctx.fillStyle='#b4bccd';ctx.fillText(`${game.pellets.size} PELLETS LEFT${overlay.checked?'  ·  '+game.expanded+' SEARCH NODES':''}`,300,650)
    if(game.state!=='playing'||!playing){ctx.fillStyle='#080b12dd';ctx.fillRect(130,310,340,44);ctx.fillStyle=game.state==='lost'?'#ed7581':'#ffdc45';ctx.font='bold 24px Atkinson, sans-serif';ctx.fillText(game.state==='won'?'MAZE CLEARED':game.state==='lost'?'GAME OVER':game.tick?'PAUSED':'READY · PRESS PLAY',300,339)}
  }
  function key(e:KeyboardEvent){if((e.target as HTMLElement)?.closest('input,select,textarea'))return;if(e.code==='Space'){if((e.target as HTMLElement)?.closest('button'))return;e.preventDefault();play.click();return}if(game.ai)return;const map:Record<string,Direction>={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};const d=map[e.key];if(d){e.preventDefault();turn(d)}}
  const stop=()=>{if(document.hidden)pause()};document.addEventListener('keydown',key);document.addEventListener('visibilitychange',stop);render(performance.now());report()
  return ()=>{playing=false;cancelAnimationFrame(animation);document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',stop)}
}
