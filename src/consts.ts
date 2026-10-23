import type { Site, Page, Links, Socials } from "@types"
export const SITE: Site = {
  TITLE: "Axel Fernández",
  DESCRIPTION: "Senior Software Engineer in Costa Rica, leading frontend architecture, React design systems, and technical direction for a seven-developer team.",
  AUTHOR: "Axel Fernández Jiménez",
}
export const WORK: Page = { TITLE: "Selected experience", DESCRIPTION: "Frontend leadership and fullstack experience at Universal Music Group, Build, Intel, Tebra, Kyndryl, and First Factory." }
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
  { NAME: "LinkedIn", ICON: "linkedin", TEXT: "/axelafj", HREF: "https://www.linkedin.com/in/axelafj/" },
]
