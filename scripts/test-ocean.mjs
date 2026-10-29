import assert from 'node:assert/strict'
import { Ocean, LIMIT, SPECIES } from '../src/lib/ocean.ts'
import { Ocean as BruteOcean } from './fixtures/ocean-before.ts'

const a = new Ocean(42), b = new Ocean(42)
assert.deepEqual(a.agents, b.agents, 'same seed recreates the same initial state')
for (let i = 0; i < 90; i++) { a.step(1 / 30); b.step(1 / 30) }
assert.deepEqual(a.agents, b.agents, 'fixed steps remain deterministic')
const time = a.time
for (const dt of [NaN, Infinity, -1, 0]) a.step(dt)
assert.equal(a.time, time, 'invalid time inputs do not advance simulation')
a.step(999)
assert.ok(a.time - time <= 1 / 30 + 1e-10, 'a long frame cannot create an unbounded step')
const full = new Ocean(99)
for (let i = 0; i < LIMIT; i++) full.add(SPECIES[i % 4])
assert.equal(full.agents.length, LIMIT)
assert.equal(full.add('prey'), false, 'manual population growth is bounded')
for (let i = 0; i < 900; i++) {
  full.step(1 / 30)
  assert.ok(full.agents.length <= LIMIT, 'births and algae growth respect population cap')
  for (const agent of full.agents) {
    assert.ok([agent.x, agent.y, agent.vx, agent.vy, agent.energy].every(Number.isFinite))
    assert.ok(agent.x >= 8 && agent.x <= 952 && agent.y >= 8 && agent.y <= 532)
  }
}
const meal = new Ocean(1)
meal.agents = []
meal.add('prey', 200, 200); meal.add('algae', 201, 200)
meal.agents[0].energy = 10
meal.step(1 / 30)
assert.equal(meal.counts().algae, 0, 'nearby food is consumed')
assert.ok(meal.agents[0].energy > 10, 'feeding replenishes energy')
assert.equal(new Set(full.agents.map(x => x.id)).size, full.agents.length)
for (const capacity of [180, 600, 1200, 2400]) {
  const world = new Ocean(42, capacity, 12)
  assert(world.agents.length <= capacity)
  assert.equal(world.capacity, capacity)
  assert(SPECIES.every(kind => world.counts()[kind] > 0), 'small capacities retain every trophic level')
}
assert.equal(new Ocean(42, NaN, Infinity).capacity, LIMIT)
assert.equal(new Ocean(42, 0).capacity, 180)
assert.equal(new Ocean(42, LIMIT * 10).capacity, LIMIT)
assert.equal(meal.add('prey', NaN, 10), false)
assert.equal(meal.add('prey', 10, Infinity), false)
for (const [x, y] of [[64,64], [128,192], [896,512]]) {
  const boundary = new Ocean(1)
  boundary.agents = []
  boundary.add('prey', x - 1, y - 1); boundary.add('algae', x + 1, y + 1)
  boundary.agents[0].energy = 1
  boundary.step(1/30)
  assert.equal(boundary.counts().algae, 0, 'feeding across both cell boundaries')
}
const sparse = new Ocean(4)
sparse.agents = []
for(let i=0;i<100;i++) sparse.add('prey', 10+(i%10)*90, 10+Math.floor(i/10)*50)
sparse.step(1/30)
assert(sparse.neighborChecks < 100*99*.4, 'spatial grid excludes distant agents')
// The original all-pairs engine is an independent neighbor-search oracle.
// Before regeneration, spatial queries must preserve its movement/feeding rules.
for (const seed of [1, 42, 999]) {
  const spatial = new Ocean(seed, 180), brute = new BruteOcean(seed)
  for(let frame=0;frame<30;frame++) {
    spatial.step(1/30); brute.step(1/30)
    assert.deepEqual(spatial.agents.map(a=>a.id), brute.agents.map(a=>a.id))
    for(let i=0;i<spatial.agents.length;i++) for(const key of ['x','y','vx','vy','energy']) {
      assert(Math.abs(spatial.agents[i][key]-brute.agents[i][key]) < 1e-8, `grid agrees with brute-force ${key}`)
    }
  }
}
console.log('Ocean simulation: seed, feeding, frame budget, finite state, bounds and population-cap checks passed.')
