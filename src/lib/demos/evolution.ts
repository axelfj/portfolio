export function random(seed:number){let x=seed>>>0;return ()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296}}
export type DNA={wheel:number;power:number;grip:number;body:number}
export type Car={dna:DNA;x:number;speed:number;best:number;stalled:number;alive:boolean}
export const ground=(x:number)=>340-35*Math.sin(x/105)-22*Math.sin(x/43)-x*.035
export class Evolution {
  rng:()=>number;cars:Car[]=[];generation=1;time=0;best=20;history:number[]=[];mutation=.15
  constructor(seed=42){this.rng=random(seed);this.cars=Array.from({length:24},()=>this.make({wheel:10+this.rng()*16,power:.5+this.rng()*2.5,grip:.2+this.rng()*.8,body:25+this.rng()*35}))}
  make(dna:DNA):Car{return {dna,x:20,speed:0,best:20,stalled:0,alive:true}}
  step(dt:number){dt=Math.max(0,Math.min(.05,dt));this.time+=dt
    for(const c of this.cars){if(!c.alive)continue;const d=c.dna,slope=(ground(c.x+2)-ground(c.x-2))/4
      // A bounded one-dimensional hill model, not a Box2D rigid-body simulation.
      const drive=d.power*220*d.grip/(d.body*.35+d.wheel*.5),resistance=1.1+c.speed*.018
      c.speed=Math.max(0,Math.min(95,c.speed+(drive+slope*10-resistance)*dt));c.x=Math.min(4000,c.x+c.speed*dt)
      if(c.x>c.best+.1){c.best=c.x;c.stalled=0}else c.stalled+=dt
      if(c.stalled>3||c.x>=4000)c.alive=false
    }this.best=Math.max(this.best,...this.cars.map(c=>c.best))
    if(this.time>=22||this.cars.every(c=>!c.alive))this.next()
  }
  next(){const ranked=[...this.cars].sort((a,b)=>b.best-a.best);this.history.push(ranked[0].best);if(this.history.length>80)this.history.shift();const next=[this.make({...ranked[0].dna}),this.make({...ranked[1].dna})]
    const pick=()=>{const a=ranked[Math.floor(this.rng()*ranked.length)],b=ranked[Math.floor(this.rng()*ranked.length)];return a.best>b.best?a:b}
    while(next.length<24){const a=pick(),b=pick(),dna={...a.dna};for(const key of ['wheel','power','grip','body'] as const){dna[key]=this.rng()<.5?a.dna[key]:b.dna[key];if(this.rng()<this.mutation)dna[key]*=.75+this.rng()*.5}
      dna.wheel=Math.max(8,Math.min(30,dna.wheel));dna.power=Math.max(.3,Math.min(3,dna.power));dna.grip=Math.max(.1,Math.min(1,dna.grip));dna.body=Math.max(20,Math.min(65,dna.body));next.push(this.make(dna))}
    this.cars=next;this.time=0;this.generation++
  }
}
