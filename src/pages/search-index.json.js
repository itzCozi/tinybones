import { getCollection } from "astro:content";
import { SITE } from "@/siteConfig";

export async function GET() {
  const posts = await getCollection("blog");

  const searchData = posts.map((post) => {
    let contentText = "";

    const stripMDXComponentsAndMarkdown = (input = "") => {
      try {
        let text = String(input);
        text = text.replace(/^\s*(import|export)\s[^\n]*$/gim, " ");
        text = text.replace(/```[\s\S]*?```/g, " ");
        text = text.replace(/`[^`]*`/g, " ");
        text = text.replace(/!\[([^\]]*)\]\((?:[^)]+)\)/g, "$1");
        text = text.replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, "$1");
        text = text.replace(/<[^>]+>/g, " ");
        text = text.replace(/^\s*#{1,6}\s*/gim, "");
        text = text.replace(/^\s*>+\s?/gim, "");
        text = text.replace(/\{[^}]*\}/g, " ");
        text = text.replace(/\s+/g, " ").trim();
        return text;
      } catch (e) {
        return String(input || "").replace(/\s+/g, " ").trim();
      }
    };

    try {
      contentText = stripMDXComponentsAndMarkdown(post.body).substring(0, 5000);
    } catch (err) {
      console.error(`Error processing content for ${post.slug}:`, err);
    }

    return {
      title: post.data.title,
      description: post.data.description || "",
      content: contentText,
      url: `/blog/${post.id}`,
      pubDate: post.data.publicationDate,
      author: SITE.author,
      tags: post.data.tags || [],
    };
  });

  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
