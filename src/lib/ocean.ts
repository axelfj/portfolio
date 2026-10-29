export type Species = "algae" | "prey" | "predator" | "apex"
export type Agent = { id: number; kind: Species; x: number; y: number; vx: number; vy: number; energy: number; age: number; birth: number }
export const SPECIES: Species[] = ["algae", "prey", "predator", "apex"]
export const LIMIT = 2400
const CELL = 64, COLS = 15, ROWS = 9
const speeds = { algae: 0, prey: 34, predator: 43, apex: 37 }
const vision = { algae: 0, prey: 95, predator: 145, apex: 170 }
export class Ocean {
  agents: Agent[] = []
  time = 0
  current = 0.55
  private state: number
  private id = 0
  private growth = 0
  readonly capacity: number
  neighborChecks = 0
  private cells: Agent[][] = Array.from({ length: COLS * ROWS }, () => [])
  constructor(seed = 42, capacity = LIMIT, density = 1) {
    this.capacity = Math.max(180, Math.min(LIMIT, Math.floor(Number.isFinite(capacity) ? capacity : LIMIT)))
    density = Math.max(1, Math.min(12, this.capacity / 89, Number.isFinite(density) ? density : 1))
    this.state = seed >>> 0
    for (const [kind, count] of [["algae", 54], ["prey", 28], ["predator", 5], ["apex", 2]] as [Species, number][]) {
      for (let i = 0; i < Math.round(count * density); i++) this.add(kind)
    }
  }
  private random() {
    this.state = (Math.imul(1664525, this.state) + 1013904223) >>> 0
    return this.state / 4294967296
  }
  add(kind: Species, x?: number, y?: number) {
    if (this.agents.length >= this.capacity || !SPECIES.includes(kind)) return false
    if ((x !== undefined && !Number.isFinite(x)) || (y !== undefined && !Number.isFinite(y))) return false
    const angle = this.random() * Math.PI * 2
    this.agents.push({ id: this.id++, kind, x: Math.max(10, Math.min(950, x ?? 20 + this.random() * 920)),
      y: Math.max(10, Math.min(530, y ?? (kind === "algae" ? 360 + this.random() * 160 : 40 + this.random() * 440))),
      vx: Math.cos(angle) * speeds[kind], vy: Math.sin(angle) * speeds[kind], energy: 32 + this.random() * 20, age: 0, birth: 0 })
    return true
  }
  counts() {
    const counts = { algae: 0, prey: 0, predator: 0, apex: 0 }
    for (const a of this.agents) counts[a.kind]++
    return counts
  }
  private cellIndex(x: number, y: number) {
    return Math.max(0, Math.min(ROWS - 1, Math.floor(y / CELL))) * COLS + Math.max(0, Math.min(COLS - 1, Math.floor(x / CELL)))
  }
  flow(x: number, y: number) {
    const angle = Math.sin(x / 220 + this.time / 16) + Math.cos(y / 150 - this.time / 20)
    return { x: Math.cos(angle) * 12 * this.current, y: Math.sin(angle) * 12 * this.current }
  }
  step(dt: number) {
    if (!Number.isFinite(dt) || dt <= 0) return
    dt = Math.min(dt, 1 / 30)
    this.time += dt
    this.neighborChecks = 0
    for (const cell of this.cells) cell.length = 0
    for (const a of this.agents) this.cells[this.cellIndex(a.x, a.y)].push(a)
    const eaten = new Set<number>()
    const births: { kind: Species; x: number; y: number }[] = []
    for (const a of this.agents) {
      a.age += dt
      if (a.kind === "algae" || eaten.has(a.id)) continue
      a.energy -= dt * (a.kind === "apex" ? 0.6 : 0.8)
      let tx = Math.cos(a.id * 3.1 + this.time / 3) * 5
      let ty = Math.sin(a.id * 2.7 + this.time / 4) * 5
      let nearest: Agent | undefined
      let nearestD = Infinity
      let alignX = 0, alignY = 0, centerX = 0, centerY = 0, neighbors = 0
      const radius = Math.max(vision[a.kind], 105)
      const x0 = Math.max(0, Math.floor((a.x - radius) / CELL)), x1 = Math.min(COLS - 1, Math.floor((a.x + radius) / CELL))
      const y0 = Math.max(0, Math.floor((a.y - radius) / CELL)), y1 = Math.min(ROWS - 1, Math.floor((a.y + radius) / CELL))
      for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) for (const b of this.cells[cy * COLS + cx]) {
        if (b.id === a.id || eaten.has(b.id)) continue
        this.neighborChecks++
        const dx = b.x - a.x, dy = b.y - a.y
        const d2 = dx * dx + dy * dy
        if (d2 >= radius * radius) continue
        const food = a.kind === "prey" ? b.kind === "algae" : a.kind === "predator" ? b.kind === "prey" : b.kind === "prey" || b.kind === "predator"
        const threat = a.kind === "prey" ? b.kind === "predator" || b.kind === "apex" : a.kind === "predator" && b.kind === "apex"
        if (food && d2 < vision[a.kind] ** 2 && (d2 < nearestD || (d2 === nearestD && b.id < nearest!.id))) { nearest = b; nearestD = d2 }
        if (threat && d2 < 105 ** 2) { const d = Math.max(Math.sqrt(d2), 1); tx -= dx / d * 100; ty -= dy / d * 100 }
        if (b.kind === a.kind && d2 < 65 ** 2) {
          neighbors++; alignX += b.vx; alignY += b.vy; centerX += b.x; centerY += b.y
          if (d2 < 24 ** 2) { const d = Math.max(Math.sqrt(d2), 1); tx -= dx / d * 35; ty -= dy / d * 35 }
        }
      }
      if (nearest && a.energy < 62) {
        nearestD = Math.sqrt(nearestD)
        tx += (nearest.x - a.x) / Math.max(nearestD, 1) * 45
        ty += (nearest.y - a.y) / Math.max(nearestD, 1) * 45
        if (nearestD < 10) { eaten.add(nearest.id); a.energy = Math.min(80, a.energy + (nearest.kind === "algae" ? 12 : 26)) }
      }
      if (neighbors) {
        tx += (alignX / neighbors - a.vx) * 0.5 + (centerX / neighbors - a.x) * 0.08
        ty += (alignY / neighbors - a.vy) * 0.5 + (centerY / neighbors - a.y) * 0.08
      }
      if (a.x < 35) tx += 70
      if (a.x > 925) tx -= 70
      if (a.y < 35) ty += 70
      if (a.y > 505) ty -= 70
      a.vx += tx * dt; a.vy += ty * dt
      const speed = Math.hypot(a.vx, a.vy)
      if (speed > speeds[a.kind]) { a.vx *= speeds[a.kind] / speed; a.vy *= speeds[a.kind] / speed }
      const flow = this.flow(a.x, a.y)
      const previousCell = this.cellIndex(a.x, a.y)
      a.x = Math.max(8, Math.min(952, a.x + (a.vx + flow.x) * dt))
      a.y = Math.max(8, Math.min(532, a.y + (a.vy + flow.y) * dt))
      const nextCell = this.cellIndex(a.x, a.y)
      // Update moved agents immediately: later fish see their current position,
      // including crossings of a cell boundary during this same step.
      if (previousCell !== nextCell) {
        const bucket = this.cells[previousCell]
        bucket.splice(bucket.indexOf(a), 1)
        this.cells[nextCell].push(a)
      }
      if (a.age - a.birth > 14 && a.energy > 52 && this.agents.length + births.length < this.capacity) {
        births.push({ kind: a.kind, x: a.x + 12, y: a.y + 12 }); a.energy -= 20; a.birth = a.age
      }
    }
    this.agents = this.agents.filter(a => !eaten.has(a.id) && (a.kind === "algae" || a.energy > 0))
    for (const b of births) this.add(b.kind, b.x, b.y)
    this.growth += dt
    if (this.growth >= 1.5) {
      this.growth = 0
      const algae = this.counts().algae
      const target = Math.round(this.capacity * 0.44)
      for (let i = 0; i < Math.min(target - algae, Math.max(1, Math.round(this.capacity / 180))); i++) this.add("algae")
    }
  }
}
