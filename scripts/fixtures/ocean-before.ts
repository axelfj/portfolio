export type Species = "algae" | "prey" | "predator" | "apex"
export type Agent = { id: number; kind: Species; x: number; y: number; vx: number; vy: number; energy: number; age: number; birth: number }
export const SPECIES: Species[] = ["algae", "prey", "predator", "apex"]
export const LIMIT = 180
const speeds = { algae: 0, prey: 34, predator: 43, apex: 37 }
const vision = { algae: 0, prey: 95, predator: 145, apex: 170 }
export class Ocean {
  agents: Agent[] = []
  time = 0
  current = 0.55
  private state: number
  private id = 0
  private growth = 0
  constructor(seed = 42) {
    this.state = seed >>> 0
    for (const [kind, count] of [["algae", 54], ["prey", 28], ["predator", 5], ["apex", 2]] as [Species, number][]) {
      for (let i = 0; i < count; i++) this.add(kind)
    }
  }
  private random() {
    this.state = (Math.imul(1664525, this.state) + 1013904223) >>> 0
    return this.state / 4294967296
  }
  add(kind: Species, x?: number, y?: number) {
    if (this.agents.length >= LIMIT || !SPECIES.includes(kind)) return false
    const angle = this.random() * Math.PI * 2
    this.agents.push({ id: this.id++, kind, x: Math.max(10, Math.min(950, x ?? 20 + this.random() * 920)),
      y: Math.max(10, Math.min(530, y ?? (kind === "algae" ? 360 + this.random() * 160 : 40 + this.random() * 440))),
      vx: Math.cos(angle) * speeds[kind], vy: Math.sin(angle) * speeds[kind], energy: 32 + this.random() * 20, age: 0, birth: 0 })
    return true
  }
  counts() { return Object.fromEntries(SPECIES.map(k => [k, this.agents.filter(a => a.kind === k).length])) as Record<Species, number> }
  flow(x: number, y: number) {
    const angle = Math.sin(x / 220 + this.time / 16) + Math.cos(y / 150 - this.time / 20)
    return { x: Math.cos(angle) * 12 * this.current, y: Math.sin(angle) * 12 * this.current }
  }
  step(dt: number) {
    if (!Number.isFinite(dt) || dt <= 0) return
    dt = Math.min(dt, 1 / 30)
    this.time += dt
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
      for (const b of this.agents) {
        if (b.id === a.id || eaten.has(b.id)) continue
        const dx = b.x - a.x, dy = b.y - a.y
        const d = Math.hypot(dx, dy)
        const food = a.kind === "prey" ? b.kind === "algae" : a.kind === "predator" ? b.kind === "prey" : b.kind === "prey" || b.kind === "predator"
        const threat = a.kind === "prey" ? b.kind === "predator" || b.kind === "apex" : a.kind === "predator" && b.kind === "apex"
        if (food && d < vision[a.kind] && d < nearestD) { nearest = b; nearestD = d }
        if (threat && d < 105) { tx -= dx / Math.max(d, 1) * 100; ty -= dy / Math.max(d, 1) * 100 }
        if (b.kind === a.kind && d < 65) {
          neighbors++; alignX += b.vx; alignY += b.vy; centerX += b.x; centerY += b.y
          if (d < 24) { tx -= dx / Math.max(d, 1) * 35; ty -= dy / Math.max(d, 1) * 35 }
        }
      }
      if (nearest && a.energy < 62) {
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
      a.x = Math.max(8, Math.min(952, a.x + (a.vx + flow.x) * dt))
      a.y = Math.max(8, Math.min(532, a.y + (a.vy + flow.y) * dt))
      if (a.age - a.birth > 14 && a.energy > 52 && this.agents.length + births.length < LIMIT) {
        births.push({ kind: a.kind, x: a.x + 12, y: a.y + 12 }); a.energy -= 20; a.birth = a.age
      }
    }
    this.agents = this.agents.filter(a => !eaten.has(a.id) && (a.kind === "algae" || a.energy > 0))
    for (const b of births) this.add(b.kind, b.x, b.y)
    this.growth += dt
    if (this.growth >= 1.5) { this.growth = 0; if (this.counts().algae < 80) this.add("algae") }
  }
}
