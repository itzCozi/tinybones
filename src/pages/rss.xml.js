import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@/siteConfig";

export async function GET(context) {
  const blog = (await getCollection("blog")).filter((post) => !post.data.draft);
  const snippets = (await getCollection("snippets")).filter((snippet) => !snippet.data.draft);

  const blogItems = blog.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.publicationDate,
    link: `/blog/${post.id}`,
  }));

  const snippetItems = snippets.map((snippet) => ({
    title: `[Snippet] ${snippet.data.title}`,
    description: snippet.data.description,
    pubDate: snippet.data.publicationDate,
    link: `/snippets/${snippet.id}`,
  }));

  const allItems = [...blogItems, ...snippetItems].sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()
  );

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: allItems,
  });
}
