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
