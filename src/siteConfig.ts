import type {
  SiteConfiguration,
  NavigationLinks,
  SocialLink,
  GiscusConfig,
} from "@/types.ts";

export const SITE: SiteConfiguration = {
  title: "TinyBones",
  description: "A minimal blog template for your thoughts",
  href: "https://tinybones.pages.dev/",
  author: "BadDeveloper",
  locale: "en-US",
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/itzcozi/tinybones",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/sudoflix",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/cooperransom",
  },
];

export const NAV_LINKS: NavigationLinks = {
  about: {
    path: "/about",
    label: "About",
  },
  blog: {
    path: "/blog",
    label: "Blog",
  },
  projects: {
    path: "/projects",
    label: "Projects",
  },
};

// Giscus Comments Configuration
// To enable comments:
// 1. Set enabled to true
// 2. Set up Giscus on your GitHub repository: https://giscus.app/
// 3. Fill in your repository details below
export const GISCUS_CONFIG: GiscusConfig = {
  enabled: true,
  repo: "itzcozi/keyboard-cat",
  repoId: "R_kgDONgUFAA",
  category: "Announcements",
  categoryId: "DIC_kwDONgUFAM4CuYkr",
  mapping: "pathname",
  strict: false,
  reactionsEnabled: true,
  emitMetadata: false,
  inputPosition: "top",
  theme: "light", // Will be dynamically changed
  lang: "en",
  loading: "lazy",
};
