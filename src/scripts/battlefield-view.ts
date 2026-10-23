import {Battlefield,type BattleEvent} from '../lib/demos/battlefield'
import {units,type Soldier} from '../lib/demos/boards'
import '../styles/battlefield.css'

const team=(side:number)=>side===1?'Blue':'Red'
function figure(kind:string,side:number){
  const wrap=document.createElement('span');wrap.className=`battle-figure army-${side}`;wrap.setAttribute('aria-hidden','true')
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 72 72')
  const use=document.createElementNS(svg.namespaceURI,'use');use.setAttribute('href',`/battlefield/characters.svg#${kind.toLowerCase()}`);svg.append(use);wrap.append(svg);return wrap
}
export function mountBattlefield(board:HTMLElement,controls:HTMLElement,details:HTMLElement,status:HTMLElement){
  const game=new Battlefield(),timers=new Set<ReturnType<typeof setTimeout>>();let focusCell=0
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)')
  board.closest('.lab')!.classList.add('battlefield-lab')
  const button=(text:string,fn:()=>void,parent=controls)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',fn);parent.append(b);return b}
  const turn=document.createElement('div');turn.className='battle-turn';controls.append(turn)
  const end=button('End turn',()=>{game.endTurn();render()});end.className='battle-end-turn'
  button('New skirmish',()=>{game.quickStart();render()});button('Build armies',()=>{game.startDraft();render()})
  const draft=document.createElement('div');draft.className='battle-recruitment';controls.append(draft)
  const recruits:Record<string,HTMLButtonElement>={}
  Object.entries(units).forEach(([kind,u])=>{const b=button('',()=>{game.recruit(kind);render()},draft);b.className='battle-recruit';b.append(figure(kind,1));const label=document.createElement('span');label.textContent=`${kind} · ${u.cost} coins`;b.append(label);recruits[kind]=b})
  const ready=button('Ready',()=>{game.ready();render()},draft)
  const info=document.createElement('div');info.className='battle-info';details.append(info)
  const roster=document.createElement('div');roster.className='battle-roster';roster.setAttribute('role','group');roster.setAttribute('aria-label','Your characters');details.append(roster)
  const help=document.createElement('p');help.className='battle-help';help.textContent='Select one of your characters, then a blue tile to move or a red-ringed enemy to attack. Each character moves OR attacks once per turn. Use End turn to hand control to the other player. Arrow keys navigate the board; Enter or Space selects.';details.append(help)
  const result=document.createElement('p');result.className='battle-result';details.append(result)
  const stats=document.createElement('details');stats.className='battle-stats';stats.innerHTML='<summary>Unit stats and rules</summary><div class="battle-stats-scroll"><table class="lab-table"><thead><tr><th scope="col">Character</th><th scope="col">Cost</th><th scope="col">HP</th><th scope="col">Attack</th><th scope="col">Armor</th><th scope="col">Range</th><th scope="col">Move</th></tr></thead><tbody>'+Object.entries(units).map(([kind,u])=>`<tr><th scope="row">${kind}</th>${[u.cost,u.hp,u.attack,u.defense,u.range,u.move].map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')+'</tbody></table></div><p>Movement follows open orthogonal tiles. Archers can shoot across occupied tiles within range. Damage is attack minus armor, with a minimum of 1. Defeat every opposing character to win. This is a local two-player game.</p>';details.append(stats)

  function select(p:Soldier){if(game.select(p.id)){focusCell=p.y*8+p.x;render()}}
  function choose(x:number,y:number){focusCell=y*8+x;const own=game.army.find(p=>p.x===x&&p.y===y&&p.side===game.turn)
    if(own){select(own);return}
    const mover=board.querySelector<HTMLElement>(`[data-unit="${game.selected}"] .battle-figure`),fromRect=mover?.getBoundingClientRect()
    const victim=game.army.find(p=>p.x===x&&p.y===y),casualty=victim?figure(victim.kind,victim.side):null
    const event=game.act(x,y);if(!event)return;render();animate(event,fromRect,casualty)
  }
  function animate(event:BattleEvent,fromRect:DOMRect|undefined,casualty:HTMLElement|null){if(reduced.matches)return
    if(event.type==='move'&&fromRect){const moved=board.querySelector<HTMLElement>(`[data-unit="${event.id}"] .battle-figure`);if(moved){const to=moved.getBoundingClientRect();moved.animate([{transform:`translate(${fromRect.x-to.x}px,${fromRect.y-to.y}px)`},{transform:'translate(0,0)'}],{duration:320,easing:'ease-out'});moved.classList.add('battle-march')}}
    else if(event.type==='attack'){const tile=board.querySelector<HTMLElement>(`[data-cell="${event.to.y*8+event.to.x}"]`)!;tile.classList.add('battle-hit');const damage=document.createElement('span');damage.className='battle-damage';damage.textContent=`−${event.damage}`;damage.setAttribute('aria-hidden','true');tile.append(damage)
      if(event.defeated&&casualty){casualty.classList.add('battle-casualty');tile.append(casualty)}
      const timer=setTimeout(()=>{damage.remove();casualty?.remove();tile.classList.remove('battle-hit');timers.delete(timer)},850);timers.add(timer)
    }
  }
  function render(){const restoreFocus=board.contains(document.activeElement);board.innerHTML=''
    const grid=document.createElement('div');grid.className='battle-grid';grid.setAttribute('role','group');grid.setAttribute('aria-label','Battlefield, eight rows by eight columns');board.append(grid)
    const selected=game.army.find(p=>p.id===game.selected),moves=game.targets()
    for(let y=0;y<8;y++)for(let x=0;x<8;x++){
      const p=game.army.find(p=>p.x===x&&p.y===y),move=moves.find(m=>m.x===x&&m.y===y),index=y*8+x
      const tile=button('',()=>choose(x,y),grid);tile.className=`battle-tile ${(x+y)%2?'battle-tile-alt':''}${p?' army-'+p.side:''}${p?.id===game.selected?' battle-selected':''}${p?.acted?' battle-spent':''}${move?move.attack?' battle-target':' battle-move':''}`
      tile.dataset.cell=String(index);tile.tabIndex=index===focusCell?0:-1;tile.disabled=game.phase!=='battle'
      tile.setAttribute('aria-label',`${String.fromCharCode(65+x)}${8-y}: ${p?`${team(p.side)} ${p.kind}, ${p.hp} of ${units[p.kind].hp} HP${p.acted?', already acted':''}`:'empty'}${move?move.attack?', attack target':', move destination':''}`)
      if(p){tile.dataset.unit=String(p.id);tile.append(figure(p.kind,p.side));const health=document.createElement('span');health.className='battle-health';health.setAttribute('aria-hidden','true');const fill=document.createElement('span');fill.style.width=`${p.hp/units[p.kind].hp*100}%`;if(p.hp/units[p.kind].hp<.3)fill.className='battle-health-low';health.append(fill);tile.append(health);if(p.acted){const done=document.createElement('span');done.className='battle-done';done.textContent='✓';done.setAttribute('aria-hidden','true');tile.append(done)}}
    }
    if(restoreFocus)grid.querySelector<HTMLButtonElement>(`[data-cell="${focusCell}"]`)?.focus({preventScroll:true})
    const living=game.army.filter(p=>p.side===game.turn),available=living.filter(p=>!p.acted).length
    turn.className=`battle-turn army-${game.turn}`;turn.textContent=game.phase==='finished'?`${team(game.winner)} victory`:game.phase==='draft'?`${team(game.turn)} army · ${game.budget[game.turn]} coins`:`${team(game.turn)} army · ${available}/${living.length} ready`
    draft.hidden=game.phase!=='draft';end.disabled=game.phase!=='battle';ready.disabled=!living.length;recruits.Archer.parentElement!.classList.toggle('army-red-draft',game.turn===2)
    Object.entries(recruits).forEach(([kind,b])=>{b.disabled=game.budget[game.turn]<units[kind].cost||living.length>=8;b.querySelector('.battle-figure')!.className=`battle-figure army-${game.turn}`})
    info.innerHTML='';if(selected){info.append(figure(selected.kind,selected.side));const text=document.createElement('div');text.innerHTML=`<h2>${team(selected.side)} ${selected.kind}</h2><p>${selected.hp}/${units[selected.kind].hp} HP · Move ${units[selected.kind].move} · Range ${units[selected.kind].range}</p><p>Attack ${units[selected.kind].attack} · Armor ${units[selected.kind].defense}</p>`;info.append(text)}else{const text=document.createElement('p');text.textContent=game.phase==='draft'?'Choose your characters above. Each army has 12 coins.':game.phase==='finished'?`${team(game.winner)} wins. Start a new skirmish to play again.`:available?'Choose a character on the board or in your roster below.':'All your characters have acted. End your turn to continue.';info.append(text)}
    roster.innerHTML='';roster.hidden=game.phase!=='battle';living.forEach(p=>{const b=button('',()=>select(p),roster);b.className='battle-roster-character';b.disabled=p.acted;b.setAttribute('aria-label',`Select ${team(p.side)} ${p.kind}, ${p.hp} HP${p.acted?', already acted':''}`);b.setAttribute('aria-pressed',String(p.id===game.selected));b.append(figure(p.kind,p.side));const text=document.createElement('span');text.textContent=`${p.kind} · ${p.hp} HP${p.acted?' · Done':''}`;b.append(text)})
    result.textContent=game.log;status.textContent=`${game.phase==='finished'?team(game.winner)+' wins':team(game.turn)+' army'} · ${game.log}`
  }
  function key(e:KeyboardEvent){const tile=(e.target as HTMLElement).closest<HTMLElement>('[data-cell]');if(!tile||game.phase!=='battle')return;const i=Number(tile.dataset.cell),x=i%8,y=Math.floor(i/8),delta:Record<string,[number,number]>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};const d=delta[e.key];if(!d)return;e.preventDefault();const nx=x+d[0],ny=y+d[1];if(nx<0||nx>7||ny<0||ny>7)return;tile.tabIndex=-1;focusCell=ny*8+nx;const next=board.querySelector<HTMLButtonElement>(`[data-cell="${focusCell}"]`)!;next.tabIndex=0;next.focus()}
  board.addEventListener('keydown',key);render();return ()=>{board.removeEventListener('keydown',key);timers.forEach(clearTimeout)}
}
