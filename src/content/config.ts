import { defineCollection, z } from "astro:content"

const work = defineCollection({
  type: "content",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
  }),
})


const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
    demoUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    category: z.enum(["engineering", "simulations", "games"]).default("engineering"),
    demoStatus: z.enum(["planned", "prototype", "live"]).optional(),
    sourceAccess: z.enum(["public", "private"]).default("public"),
    legacy: z.boolean().default(false),
  }),
})


export const collections = { work, projects }
