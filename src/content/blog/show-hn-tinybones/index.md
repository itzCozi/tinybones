---
title: "Show HN: TinyBones"
description: "Open‑source Astro blog starter focused on speed, accessibility (incl. dyslexia‑friendly mode), and clean typography. Demo + repo inside."
publicationDate: 2025-09-30
imageAlt: "Screenshot of the TinyBones blog template"
tags:
  - Show HN
  - TinyBones
authors:
  - BadDeveloper
comments: true
---

TinyBones is a minimalist, batteries‑included blog template built with [Astro](https://astro.build). It focuses on:

- Speed: ships almost zero JS by default on content pages
- Accessibility: includes a dyslexia‑friendly font toggle and high‑contrast theming
- Writing ergonomics: clean typography, MD/MDX support, TOC, code copy, and sensible defaults

Live demo: https://tinybones.pages.dev/

Source: https://github.com/itzcozi/tinybones

## Why I built it

Most blog starters are either too heavy or too bare. I wanted a tiny, readable baseline that I could deploy quickly without sacrificing quality of life features (TOC, search, comments). TinyBones started as my personal starter and is now a tidy template you can clone and ship.

## Highlights

- MD + MDX content out of the box
- First‑class SEO: `<SeoPost />` and `<SeoPage />`, RSS, sitemap, robots
- In‑page Table of Contents and automatic reading‑time
- Tag pages and author pages
- Built‑in search (client‑side fuzzy search + index generator)
- Share buttons and copy‑code buttons
- Giscus comments integration (toggle per post)
- Dark mode and dyslexia‑friendly font toggle
- Lightweight, accessible components with Tailwind v4

## Quick start

1) Clone the repo

```powershell
# Windows PowerShell
git clone https://github.com/itzcozi/tinybones.git
cd tinybones
pnpm install
pnpm dev
```

Then open http://localhost:4321.

2) Create your first post

```md
src/content/blog/my-first-post/index.md

---
title: "My first post"
description: "A short hello."
publicationDate: 2025-09-30
tags: [Hello]
authors: ["BadDeveloper"]
---

Write your content here.
```

## What’s inside

- `src/content/` — your posts (MD/MDX), validated with a Zod schema
- `src/components/` — SEO, TOC, search, share, toggles, MDX UI (tabs, infobox)
- `src/pages/` — blog listing, tag and author routes, RSS, Open Graph images
- `public/` — favicons and the dyslexia font assets

## Performance

Astro renders static HTML by default, so content pages ship minimal JS. Interactive bits like search and theme/dyslexia toggles hydrate only where needed.

## Configuring comments

If you use Giscus, flip `enabled: true` in `src/siteConfig.ts` and drop in your repo details. You can disable comments per‑post via frontmatter: `comments: false`.

## Roadmap

- Draft/preview mode
- Image CDN helpers and captions
- More MDX shortcodes

## License

MIT. Free to use for personal and commercial projects.

If you try it, I’d love feedback—especially around accessibility and the writing flow. Thanks for reading!