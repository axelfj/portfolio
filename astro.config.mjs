import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "tailwindcss"
import solidJs from "@astrojs/solid-js"

// https://astro.build/config
export default defineConfig({
  site: "https://afernandezdev.vercel.app",
  integrations: [mdx(), sitemap(), solidJs()],
  vite: { css: { postcss: { plugins: [tailwindcss()] } } },
})