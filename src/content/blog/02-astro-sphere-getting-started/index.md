---
title: "Astro Sphere: Getting Started"
summary: "You've downloaded and installed the project. Let's hit the ground running."
date: "Mar 16 2024"
draft: false
tags:
- Tutorial
- Astro
- Astro Sphere
---

Astro Sphere is designed to be configurable. This article will cover the basics on
configuring the site and make it personal.

### First let's change the url

```js
//astro.config.mjs

export default defineConfig({
  site: "https://afernandezdev.vercel.app", // your domain here
  integrations: [mdx(), sitemap(), solidJs(), tailwind({ applyBaseStyles: false })],
})
```

### Next, Let's configure the Site

```js
// src/consts.ts

export const SITE: Site = {
  TITLE: "Portfolio",
  DESCRIPTION: "Welcome to my portfolio as SOFTWARE ENGINEER.",
  AUTHOR: "Axel Fernandez J.",
}
```

| Field       | Type   | Description                                                            |
| :---------- | :----- | :--------------------------------------------------------------------- |
| TITLE       | String | The title of the website. Displayed in header and footer. Used in SEO. |
| DESCRIPTION | String | The description of the index page of the website. Used in SEO.         |
| AUTHOR      | String | Your name.                                                             |

### Change the branding

The browser icon is located in `/public/favicon.svg`

The header and footer branding icon is located in `/public/brand.svg` as a sprite with id="brand"

### The rest of the consts file

Each page has a metadata entry that is useful for SEO.

```js
export const WORK: Page = {
  TITLE: "Work",
  DESCRIPTION: "Places I have worked.",
}
```

The links that are displayed in the header and drawer

```js
export const LINKS: Links = [
  { HREF: "/", TEXT: "Home" },
  { HREF: "/work", TEXT: "Work" },
  { HREF: "/blog", TEXT: "Blog" },
  { HREF: "/projects", TEXT: "Projects" },
]
```

The social media links

```js
export const SOCIALS: Socials = [
  { 
    NAME: "Github",
    ICON: "github",
    TEXT: "axelfj",
    HREF: "https://github.com/axelfj"
  },
]
```

| Field | Type | Required | Description |
| :---- | :--- | :------- | :---------- |
| NAME  | string | yes | Accessible name |
| ICON  | string | yes | Refers to the symbol id in `public/social.svg` |
| TEXT  | string | yes | Shorthand profile name |
| HREF  | string | yes | The link to the social media profile |