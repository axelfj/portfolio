import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import type { APIContext } from "astro"
import { SITE } from "@consts"
export async function GET(context: APIContext) {
  const projects = (await getCollection("projects")).filter(p => !p.data.draft).sort((a,b) => b.data.date.getTime() - a.data.date.getTime())
  return rss({
    title: SITE.TITLE, description: SITE.DESCRIPTION, site: context.site!,
    items: projects.map(item => ({ title: item.data.title, description: item.data.summary, pubDate: item.data.date, link: "/projects/" + item.id + "/" })),
  })
}
