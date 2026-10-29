// Node 24: node scripts/benchmark-ocean.mjs
// Engine-only timings; browser drawing and device performance are separate measurements.
import {readFileSync} from 'node:fs'
import {stripTypeScriptTypes} from 'node:module'
import {performance} from 'node:perf_hooks'
import {Ocean, SPECIES} from '../src/lib/ocean.ts'
const baselineSource=readFileSync(new URL('./fixtures/ocean-before.ts', import.meta.url),'utf8').replace('export const LIMIT = 180','export const LIMIT = 2400')
const {Ocean: Baseline}=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(baselineSource)).toString('base64'))
const rows=[]
for(const population of [180,600,1200,2400]) {
  const initial=new Ocean(42)
  for(let i=initial.agents.length;i<population;i++) initial.add(SPECIES[i%4])
  const snapshot=structuredClone(initial.agents)
  const times={}
  let checks=0
  for(const [name,Engine] of [['baseline',Baseline],['spatial',Ocean]]) {
    const samples=[]
    for(let trial=0;trial<3;trial++) {
      const world=new Engine(42)
      world.agents=structuredClone(snapshot)
      // Stable workload: re-use identical input each step so reproduction and
      // feeding cannot make one implementation benchmark a smaller population.
      for(let warm=0;warm<10;warm++) {world.agents=structuredClone(snapshot);world.step(1/30)}
      let elapsed=0
      for(let frame=0;frame<30;frame++) {
        world.agents=structuredClone(snapshot)
        const start=performance.now();world.step(1/30);elapsed+=performance.now()-start
        if(name==='spatial') checks=world.neighborChecks
      }
      samples.push(elapsed/30)
    }
    samples.sort((a,b)=>a-b)
    times[name]=Number(samples[1].toFixed(3))
  }
  rows.push({population,baselineMs:times.baseline,spatialMs:times.spatial,speedup:Number((times.baseline/times.spatial).toFixed(2)),neighborChecks:checks})
  console.error(`Completed ${population} organisms`)
}
console.log(JSON.stringify({runtime:process.version,platform:process.platform,arch:process.arch,method:'Median of 3 trials, each 30 steps after 10 warmup steps; identical seeded input restored outside timed region every step; baseline cap lifted only for comparison.',rows},null,2))

