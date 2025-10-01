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

# Show HN: TinyBones

TinyBones is a minimalist, batteries‑included blog template built with [Astro](https://astro.build). It focuses on:

- Speed: ships almost zero JS by default on content pages
- Accessibility: includes a dyslexia‑friendly font toggle and high‑contrast theming
- Writing ergonomics: clean typography, MD/MDX support, TOC, code copy, and sensible defaults

## Why I built it

Most blog starters are either too heavy or too bare. I wanted a tiny, readable baseline that I could deploy quickly without sacrificing quality of life features (TOC, search, comments). TinyBones started as my personal starter and is now a tidy template you can clone and ship.

## Highlights

- **Minimal and fast:** Built with Astro for optimal performance and minimal JavaScript
- **SEO-friendly:** Sitemap, RSS feed, and Open Graph protocol support out of the box
- **Accessible:** System, dark, and light mode support with keyboard navigation
- **Developer-friendly:** TypeScript, Tailwind CSS, and modern tooling
- **MDX support:** Write interactive blog posts with custom components including built-in InfoBox admonitions
- **Comments system:** Built-in support for Giscus comments
- **CLI tool:** Create and manage blog posts and projects from the command line

## Quick start

1) Clone the repo

```bash
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


## TinyBones CLI

Ship content faster with the built-in TinyBones CLI. It helps you:

- Scaffold new blog posts (MD or MDX) and projects
- List existing posts/projects
- Safely update your blog to the latest TinyBones template (with backups)

### Install

From your project root:

```bash
# Prefer this in this repo (runs a helper script)
pnpm run setup-cli

# After linking, the `tinybones` command is available globally
```

Alternatively, you can navigate into the CLI folder and link it manually:

```bash
cd scripts/tinybones-cli
npm install
npm link
```

### Use

You can run the CLI either via the npm script or directly if globally linked:

```bash
tinybones --help
```

Common commands:

```bash
# Create a new blog post (interactive: title, description, MD/MDX)
tinybones -- create new-post

# Create a new project page (interactive)
tinybones -- create new-project

# List content
tinybones -- list posts
tinybones -- list projects

# Update to the latest TinyBones template (backs up content, creates a branch)
tinybones -- update
```

#### Notes:

- New posts/projects are created under `src/content/blog/` and `src/content/projects/` with an `index.md(x)` file and sensible frontmatter.
- The update command backs up your `src/content`, `public`, and `src/siteConfig.ts` by default, fetches the latest template, restores your content, installs deps, and checks out a new branch for review.
- If you prefer global usage, replace `tinybones --` with `tinybones` (for example, `tinybones create new-post`).

## What’s inside

- `src/content/` — your posts (MD/MDX), validated with a Zod schema
- `src/components/` — SEO, TOC, search, share, toggles, MDX UI (tabs, infobox)
- `src/pages/` — blog listing, tag and author routes, RSS, Open Graph images
- `public/` — favicons and the dyslexia font assets

## Performance

Astro renders static HTML by default, so content pages ship minimal JS. Interactive bits like search and theme/dyslexia toggles hydrate only where needed.
