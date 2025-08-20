import { getCollection } from 'astro:content';
import { SITE } from '@/siteConfig';

export async function GET(context) {
  const posts = await getCollection('blog');
  
  const searchData = posts.map(post => {
    // Get raw Markdown content from post.body
    let contentText = '';
    
    try {
      // post.body contains the raw markdown content
      contentText = post.body
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
        .substring(0, 5000); // Limit content size for performance
    } catch (err) {
      console.error(`Error processing content for ${post.slug}:`, err);
    }
    
    return {
      title: post.data.title,
      description: post.data.description || '',
      content: contentText,
      url: `/blog/${post.id}`,
      pubDate: post.data.publicationDate,
      author: SITE.author,
      tags: post.data.tags || []
    };
  });
  
  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
