import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publicationDate: z.date(),
      updatedDate: z.date().optional(),
      draft: z.boolean().default(false),
      image: image().optional(),
      imageAlt: z.string().optional(),
      tags: z.array(z.string()).optional(),
      authors: z.array(z.string()).optional(),
      // Enable/disable comments per post (defaults to true)
      comments: z.boolean().default(true),
      // Optional series support
      // `series`: slug identifier for grouping related posts
      // `seriesIndex`: order of the post within the series (1-based recommended)
      series: z.string().optional(),
      seriesIndex: z.number().int().positive().optional(),
    })
    .refine(
      (data) => !data.image || !!data.imageAlt,
      { message: "imageAlt is required when image is provided", path: ["imageAlt"] }
    ),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/projects",
  }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      publicationDate: z.date().optional(),
      href: z.string(),
    }),
});

const snippets = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/snippets" }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      publicationDate: z.date(),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).optional(),
      authors: z.array(z.string()).optional(),
    }),
});

export const collections = { blog, projects, snippets };
