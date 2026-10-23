# Axel Fernández — Portfolio

Personal digital CV built with Astro, Tailwind CSS, and TypeScript, based on [Astro Sphere](https://github.com/markhorn-dev/astro-sphere). Original licensing is retained in LICENSE.

## Development

Requires Node.js 24 and npm (matching the Vercel project runtime).

```sh
npm ci
npm run dev
npm run build
npm run preview
```

## Content

- Homepage: `src/pages/index.astro`
- Selected career history: `src/content/work/`
- Engineering highlights: `src/content/projects/`
- Identity and navigation: `src/consts.ts`
- Printable CV: `/resume`, using the same work collection as the experience page. Use Print / save as PDF.
- Dates use ISO month-start values for reliable parsing; only month and year are displayed, in UTC.

The selected timeline omits Granicus and the earlier internship. Official job titles are retained; frontend leadership responsibilities are described separately. Confidential client work is described only in general terms.

## Deployment

The canonical domain is `https://axelfernandez.vercel.app`. The previous `afernandezdev.vercel.app` address redirects permanently to it, preserving paths and query strings.

Use `npm run build` and publish `dist/`. Review the pull request and any Vercel preview before merging. No production deployment is performed by the refresh itself.

## Maintenance

Run `npm audit` when updating dependencies. The repository renders a static site; audit reports can include development tooling as well as browser dependencies. Do not treat dependency audit counts as proof that the production website is exploitable.

## Interactive project lab

`/demos/` links to eight new browser adaptations and the existing ocean demo. The new routes are `pacman`, `evolving-car`, `poison`, `tic-tac-toe`, `battlefield`, `dou-shou-qi`, `sorting`, and `graphs`. Project catalog entries link directly to the relevant demo; the algorithms article links both sorting and graphs.

These are 2026 browser implementations of earlier project ideas, not original executables. Original dates, team credits, restricted-source labels, and model limitations are retained. No private source snapshots, sprites, binaries, student IDs, or old environments are bundled. Pacman is an A* maze lab, the car uses a simplified hill model with a new evolutionary loop, and Poison is implemented from an archived brief. The battlefield uses the Java unit stats with corrected movement and damage rules. Jungle uses the documented river/trap variant linked from its page.

Run `npm run test:demos` for sorting invariants, shortest-path cross-checks, A* route validity, exhaustive human continuations against minimax, Jungle special moves, battlefield bounds, evolution determinism/fitness, and complete seeded Poison games with deck conservation. `npm run build` checks types and generates the static routes.

All animations start paused and stop on page visibility changes. Board controls are native buttons; canvas demos have text summaries/tables, and the maze also has a labeled keyboard grid. Demos run locally in the visitor's browser without external APIs or server computation.
