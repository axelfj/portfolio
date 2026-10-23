import {battleTargets,units,type Soldier} from './boards'
export type BattleEvent={type:'move'|'attack';id:number;from:{x:number;y:number};to:{x:number;y:number};targetId?:number;targetKind?:string;damage?:number;defeated?:boolean}
export class Battlefield {
  army:Soldier[]=[];turn=1;selected=-1;phase:'draft'|'battle'|'finished'='battle';budget=[0,12,12];winner=0;nextId=0;log='Blue army moves first. Select a character.'
  constructor(){this.quickStart()}
  quickStart(){this.army=[];this.turn=1;this.selected=-1;this.phase='battle';this.winner=0;this.nextId=0;this.budget=[0,0,0]
    for(const side of [1,2])for(const [kind,x,y]of [['Archer',2,6],['Cavalry',4,6],['Spearman',3,5]] as [string,number,number][]){this.army.push({id:this.nextId++,kind,side,x:side===1?x:7-x,y:side===1?y:7-y,hp:units[kind].hp,acted:false})}
    this.log='Blue army moves first. Select a character.'
  }
  startDraft(){this.army=[];this.turn=1;this.selected=-1;this.phase='draft';this.winner=0;this.nextId=0;this.budget=[0,12,12];this.log='Recruit your army, then press Ready.'}
  recruit(kind:string){const u=units[kind];if(this.phase!=='draft'||!u||this.budget[this.turn]<u.cost)return false;const index=this.army.filter(p=>p.side===this.turn).length;if(index>=8)return false
    this.army.push({id:this.nextId++,kind,side:this.turn,x:index,y:this.turn===1?7:0,hp:u.hp,acted:false});this.budget[this.turn]-=u.cost;this.log=`${kind} recruited.`;return true}
  ready(){if(this.phase!=='draft'||!this.army.some(p=>p.side===this.turn))return false;if(this.turn===1){this.turn=2;this.log='Red army: recruit your characters.'}else{this.turn=1;this.phase='battle';this.log='Armies ready. Blue moves first.'}return true}
  endTurn(){if(this.phase!=='battle')return false;this.turn=3-this.turn;this.selected=-1;this.army.forEach(p=>p.acted=false);this.log=`${this.turn===1?'Blue':'Red'} army: select a character.`;return true}
  select(id:number){const p=this.army.find(p=>p.id===id);if(this.phase!=='battle'||!p||p.side!==this.turn||p.acted)return false;this.selected=id;this.log=`${p.kind} selected. Choose a highlighted tile or enemy.`;return true}
  targets(){const p=this.army.find(p=>p.id===this.selected);return this.phase==='battle'&&p?battleTargets(p,this.army):[]}
  act(x:number,y:number):BattleEvent|null{if(this.phase!=='battle'||!Number.isInteger(x)||!Number.isInteger(y))return null;const p=this.army.find(p=>p.id===this.selected);if(!p||p.side!==this.turn||p.acted)return null;const move=this.targets().find(m=>m.x===x&&m.y===y);if(!move)return null
    const from={x:p.x,y:p.y},event:BattleEvent={type:move.attack?'attack':'move',id:p.id,from,to:{x,y}}
    if(move.attack){const target=this.army.find(p=>p.x===x&&p.y===y)!;const damage=Math.max(1,units[p.kind].attack-units[target.kind].defense);target.hp-=damage;event.damage=damage;event.targetId=target.id;event.targetKind=target.kind;event.defeated=target.hp<=0;if(event.defeated)this.army=this.army.filter(p=>p.id!==target.id);this.log=`${p.kind} hits ${target.kind} for ${damage}.${event.defeated?' '+target.kind+' defeated.':''}`}
    else{p.x=x;p.y=y;this.log=`${p.kind} moved to ${String.fromCharCode(65+x)}${8-y}.`}
    p.acted=true;this.selected=-1;if(!this.army.some(q=>q.side===3-this.turn)){this.phase='finished';this.winner=this.turn;this.log=`${this.turn===1?'Blue':'Red'} army wins!`}return event
  }
}
