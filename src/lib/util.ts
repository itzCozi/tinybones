import { SITE } from "@/siteConfig.ts";

export function formatDate(
  date: Date,
  options: {
    year?: "numeric" | "2-digit";
    month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
    day?: "numeric" | "2-digit";
  } = {},
  locale: string = SITE.locale,
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const formatOptions = { ...defaultOptions, ...options };

  return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}

export function calculateReadingTime(content: string): string {
  // Remove markdown syntax and HTML tags for more accurate word count
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[#*_~`]/g, '') // Remove markdown formatting
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  const words = cleanContent.split(' ').filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Average reading speed is 200-250 words per minute, using 200 for conservative estimate
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  
  return readingTimeMinutes === 1 ? '1 min read' : `${readingTimeMinutes} min read`;
}
