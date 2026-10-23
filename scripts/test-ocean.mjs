import assert from 'node:assert/strict'
import { Ocean, LIMIT, SPECIES } from '../src/lib/ocean.ts'

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
for (let i = 0; i < 500; i++) full.add(SPECIES[i % 4])
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
console.log('Ocean simulation: seed, feeding, frame budget, finite state, bounds and population-cap checks passed.')
