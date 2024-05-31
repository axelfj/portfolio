import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "Portfolio",
  DESCRIPTION: "Welcome to my portfolio as SOFTWARE ENGINEER.",
  AUTHOR: "Axel Fernandez J.",
}

// Work Page
export const WORK: Page = {
  TITLE: "Work",
  DESCRIPTION: "Places I have worked.",
}

// Blog Page
export const BLOG: Page = {
  TITLE: "Blog",
  DESCRIPTION: "Writing on topics I am passionate about.",
}

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Recent projects I have worked on.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
}

// Links
export const LINKS: Links = [
  { 
    TEXT: "Home", 
    HREF: "/", 
  },
  { 
    TEXT: "Work", 
    HREF: "/work", 
  },
  { 
    TEXT: "Blog", 
    HREF: "/blog", 
  },
  { 
    TEXT: "Projects", 
    HREF: "/projects", 
  },
]

// Socials
export const SOCIALS: Socials = [
  { 
    NAME: "Email",
    ICON: "email", 
    TEXT: "axelfeji@gmail.com",
    HREF: "mailto:axelfeji@gmail.com",
  },
  { 
    NAME: "Github",
    ICON: "github",
    TEXT: "/axelfj",
    HREF: "https://github.com/axelfj"
  },
  { 
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: "/axelafj",
    HREF: "https://www.linkedin.com/in/axelafj/",
  },
  { 
    NAME: "Twitter",
    ICON: "twitter-x",
    TEXT: "/axelafj",
    HREF: "https://twitter.com/axelafj",
  },
]

