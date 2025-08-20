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
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[#*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleanContent.split(' ').filter(word => word.length > 0);
  const wordCount = words.length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  return readingTimeMinutes === 1 ? '1 min read' : `${readingTimeMinutes} min read`;
}
