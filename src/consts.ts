import type { Site, Page, Links, Socials } from "@types"
export const SITE: Site = {
  TITLE: "Axel Fernández",
  DESCRIPTION: "Senior Software Engineer in Costa Rica, specializing in frontend architecture, reusable components, and technical leadership.",
  AUTHOR: "Axel Fernández Jiménez",
}
export const WORK: Page = { TITLE: "Selected experience", DESCRIPTION: "Selected experience in frontend leadership and fullstack engineering." }
export const BLOG: Page = { TITLE: "Writing", DESCRIPTION: "Notes on frontend architecture and engineering." }
export const PROJECTS: Page = { TITLE: "Selected work", DESCRIPTION: "Engineering highlights in design systems and fullstack applications." }
export const SEARCH: Page = { TITLE: "Search", DESCRIPTION: "Search engineering highlights." }
export const LINKS: Links = [
  { TEXT: "Home", HREF: "/" },
  { TEXT: "Experience", HREF: "/work" },
  { TEXT: "Selected work", HREF: "/projects" },
]
export const SOCIALS: Socials = [
  { NAME: "Email", ICON: "email", TEXT: "axelfeji@gmail.com", HREF: "mailto:axelfeji@gmail.com" },
  { NAME: "Github", ICON: "github", TEXT: "/axelfj", HREF: "https://github.com/axelfj" },
]
