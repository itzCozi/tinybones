# TinyBones 🦴

A minimal blog template built with [Astro](https://astro.build/). Perfect for developers who want a clean, fast, and customizable blog without the bloat.

> **Note:** This project is a fork of [barebones blog](https://github.com/trevortylerlee/barebones) with enhanced features and improved UI.

[![Use this template](https://img.shields.io/badge/Use%20this%20template-brightgreen?style=for-the-badge)](https://github.com/itzCozi/tinybones/generate)

## Key features

- **Minimal and fast:** Built with Astro for optimal performance and minimal JavaScript
- **SEO-friendly:** Sitemap, RSS feed, and Open Graph protocol support out of the box
- **Accessible:** System, dark, and light mode support with keyboard navigation
- **Developer-friendly:** TypeScript, Tailwind CSS, and modern tooling
- **Comments system:** Built-in support for Giscus comments

## Core Web Vitals

Performance: **100**
Accessibility: **100**
SEO: **100**

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install` or `pnpm install`
3. Update `src/siteConfig.ts` with your site details
4. Start developing: `npm run dev`
5. Build for production: `npm run build`

## Customization

- Update site configuration in `src/siteConfig.ts`
- Modify colors and styling in `src/styles/`
- Add your content in `src/content/blog/`
- Customize components in `src/components/`

## Using as a Template

1. Click the "Use this template" button at the top of the repository
2. Clone your new repository to your local machine
3. Install dependencies: `npm install` or `pnpm install`
4. Update `src/siteConfig.ts` with your site details
5. Add your content to `src/content/blog/` and `src/content/projects/`
6. Start writing and customizing!

## Keeping Your Site Updated

TinyBones includes a built-in update mechanism that allows you to get the latest template improvements while preserving your content.

To update your TinyBones-based blog:

1. Make sure you have committed all your changes (or create a backup)
2. Run: `npm run update-template`
3. Review the changes and resolve any conflicts if needed
4. Commit the updated code to your repository

The update script preserves the following directories and files:
- Your content: `src/content/`
- Your site configuration: `src/siteConfig.ts`
- Your public assets: `public/`
