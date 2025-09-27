import { SITE } from "@/siteConfig.ts";

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function formatDate(
  date: Date,
  options: {
    year?: "numeric" | "2-digit";
    month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
    day?: "numeric" | "2-digit";
  } = {},
  locale: string = SITE.locale
): string {
  const currentYear = new Date().getFullYear();
  const dateYear = date.getFullYear();

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: dateYear === currentYear ? undefined : "numeric",
    month: "short",
    day: "numeric",
  };

  const formatOptions = { ...defaultOptions, ...options };
  const formattedDate = new Intl.DateTimeFormat(locale, formatOptions).format(
    date
  );
  const day = date.getDate();
  const ordinalSuffix = getOrdinalSuffix(day);
  return formattedDate.replace(
    new RegExp(`\\b${day}\\b`),
    `${day}${ordinalSuffix}`
  );
}

export function calculateReadingTime(content: string): string {
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[#*_~`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanContent.split(" ").filter((word) => word.length > 0);
  const wordCount = words.length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  return readingTimeMinutes === 1
    ? "1 min read"
    : `${readingTimeMinutes} min read`;
}

export function paginateArray<T>(array: T[], pageSize: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < array.length; i += pageSize) {
    pages.push(array.slice(i, i + pageSize));
  }
  return pages;
}

export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}

export function slugifyAuthor(name: string, maxLength = 100): string {
  if (!name) return "";

  const slug = name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
  return slug.length > maxLength ? slug.slice(0, maxLength).replace(/-+$/g, "") : slug;
}

export function formatAuthors(authors: string[] | undefined): string {
  if (!authors || authors.length === 0) {
    return "";
  }

  if (authors.length === 1) {
    return `By ${authors[0]}`;
  }

  if (authors.length === 2) {
    return `By ${authors[0]} and ${authors[1]}`;
  }

  const lastAuthor = authors[authors.length - 1];
  const otherAuthors = authors.slice(0, -1);
  return `By ${otherAuthors.join(", ")} and ${lastAuthor}`;
}
