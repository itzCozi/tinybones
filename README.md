# TinyBones 🦴

> **Note:** This project is a fork of [barebones blog](https://github.com/trevortylerlee/barebones) with enhanced features and improved UI.

A minimal blog template built with [Astro](https://astro.build/). Perfect for developers who want a clean, fast, and customizable blog without the bloat.

[![Use this template](https://img.shields.io/badge/Use%20this%20template-brightgreen?style=for-the-badge)](https://github.com/itzCozi/tinybones/generate)

## Key features

- **Minimal and fast:** Built with Astro for optimal performance and minimal JavaScript
- **SEO-friendly:** Sitemap, RSS feed, and Open Graph protocol support out of the box
- **Accessible:** System, dark, and light mode support with keyboard navigation
- **Developer-friendly:** TypeScript, Tailwind CSS, and modern tooling
- **MDX support:** Write interactive blog posts with custom components including built-in InfoBox admonitions
- **Comments system:** Built-in support for Giscus comments
- **CLI tool:** Create and manage blog posts and projects from the command line

## Getting Started

1. Click the "Use this template" button at the top of the repository
2. Clone your new repository to your local machine
3. Install dependencies: `pnpm install`
4. Update `src/siteConfig.ts` with your site details
5. Add your content to `src/content/blog/` and `src/content/projects/` its that easy!
6. Start writing and customizing!

## Customization

- Update site configuration in `src/siteConfig.ts`
- Modify colors and styling in `src/styles/`
- Add your content in `src/content/blog/`

## CLI Tool

TinyBones comes with a built-in CLI tool to help you manage your blog content:

1. Set up the CLI tool: `pnpm setup-cli`
2. Use it to manage your blog:
   - Create a new blog post: `tinybones create new-post`
   - Create a new project: `tinybones create new-project`
   - List all posts: `tinybones list posts`
   - List all projects: `tinybones list projects`
   - Update template: `tinybones update`

For more details, see the [CLI documentation](./scripts/tinybones-cli/README.md).

## Keeping Your Site Updated

TinyBones includes a built-in update mechanism that allows you to get the latest template improvements while preserving your content.
To update your TinyBones-based blog:

1. Make sure you have committed all your changes (or create a backup)
2. Run: `tinybones update` (or the legacy command: `pnpm update-template`)
3. Review the changes and resolve any conflicts if needed
4. Commit the updated code to your repository

The update script preserves the following directories and files:

- Your content: `src/content/`
- Your site configuration: `src/siteConfig.ts`
- Your public assets: `public/`

## Building and Deploying

To build your blog for production, run:

```bash
pnpm build
```

This will generate static files in the `dist/` directory. You can then deploy these files to any static hosting provider like Vercel, Netlify, or my favorite Cloudflare Pages (which is completely free and super easy). For most providers all you have to do is link your GitHub repository and set your build command to `pnpm build` and your output directory to `dist/`.

## Package Manager

This project exclusively uses [pnpm](https://pnpm.io/) as its package manager for several reasons:

- **Disk space efficiency**: pnpm uses a content-addressable store to avoid duplication
- **Faster installations**: pnpm creates hard links instead of copying packages
- **Strict dependency management**: prevents phantom dependencies
- **Monorepo support**: built-in workspace capabilities
