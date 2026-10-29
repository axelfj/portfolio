// Generate a temporary, uncommitted baseline route for browser comparison.
// node scripts/prepare-ocean-baseline.mjs [--clean]
import {execFileSync} from 'node:child_process'
import {mkdirSync,writeFileSync,rmSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {resolve,dirname} from 'node:path'

const root=fileURLToPath(new URL('../',import.meta.url))
const baselineCommit='f7ee9c6889af1c9b496ac909ba5dbb36deba2027'
const targets=['src/lib/ocean-baseline.ts','src/pages/demos/ocean-baseline.astro']
if(process.argv.includes('--clean')){
  for(const file of targets)rmSync(resolve(root,file),{force:true})
  console.log('Temporary baseline routes removed.')
}else{
  const read=path=>execFileSync('git',['show',`${baselineCommit}:${path}`],{cwd:root,encoding:'utf8'})
  // Preserve original all-pairs behavior. Only lift the cap and multiply the
  // initial counts so both pages begin with exactly623organisms atseed42.
  const engine=read('src/lib/ocean.ts').replace('export const LIMIT = 180','export const LIMIT = 2400').replace('i < count;','i < count * 7;')
  let page=read('src/pages/demos/ocean.astro')
  page=page.replace('"../../lib/ocean"','"../../lib/ocean-baseline"')
  page=page.replace('A small ocean.','Baseline ocean.')
  page=page.replace('<p id="summary"','<p id="benchmark" aria-live="off">10-second benchmark: press Start.</p><p id="summary"')
  page=page.replace('  const colors =',`  const benchmark = document.querySelector<HTMLElement>("#benchmark")!
  let samples: number[] = [], sampleStart = 0
  function resetBenchmark() { samples = []; sampleStart = performance.now(); benchmark.textContent = "10-second benchmark: collecting…" }
  function sampleBenchmark(started: number, now: number) {
    samples.push(performance.now() - started)
    const elapsed = now - sampleStart
    if (elapsed < 10000) return
    const sorted = [...samples].sort((a, b) => a - b)
    const average = samples.reduce((a, b) => a + b, 0) / samples.length
    const p95 = sorted[Math.ceil(sorted.length * .95) - 1]
    const fps = samples.length * 1000 / elapsed
    benchmark.dataset.fps = fps.toFixed(1); benchmark.dataset.averageMs = average.toFixed(3); benchmark.dataset.p95Ms = p95.toFixed(3)
    benchmark.dataset.population = String(world.agents.length); benchmark.dataset.seconds = (elapsed / 1000).toFixed(2)
    benchmark.textContent = \`10-second sample · \${fps.toFixed(1)} rendered fps · \${average.toFixed(2)} ms avg / \${p95.toFixed(2)} ms p95 work/frame · \${world.agents.length} organisms\`
    samples = []; sampleStart = now
  }
  const colors =`)
  page=page.replace('    if (!playing) return\n','    if (!playing) return\n    const started = performance.now()\n')
  page=page.replace('draw(); report(); animation = requestAnimationFrame(tick)','draw(); report(); sampleBenchmark(started, now); animation = requestAnimationFrame(tick)')
  page=page.replace('playing = true; last = 0;','playing = true; last = 0; resetBenchmark();')
  for(const [file,content] of [[targets[0],engine],[targets[1],page]]){
    mkdirSync(dirname(resolve(root,file)),{recursive:true});writeFileSync(resolve(root,file),content)
  }
  console.log(`Generated /demos/ocean-baseline/ from ${baselineCommit}, cap2400 + initial density7 only, with10-second timing. Do not commit generated routes; run --clean before commit/build for release.`)
}
