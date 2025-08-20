export type SiteConfiguration = {
  title: string;
  description: string;
  href: string;
  author: string;
  locale: string;
};

export type GiscusConfig = {
  enabled: boolean;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: "pathname" | "url" | "title" | "og:title" | "specific" | "number";
  strict: boolean;
  reactionsEnabled: boolean;
  emitMetadata: boolean;
  inputPosition: "top" | "bottom";
  theme:
    | "light"
    | "dark"
    | "preferred_color_scheme"
    | "transparent_dark"
    | "dark_dimmed"
    | "dark_high_contrast"
    | "dark_protanopia"
    | "dark_tritanopia"
    | "light_high_contrast"
    | "light_protanopia"
    | "light_tritanopia"
    | "light"
    | "noborder_gray";
  lang: string;
  loading: "lazy" | "eager";
};

export type NavigationLinks = {
  [key: string]: NavigationLink;
};

export type NavigationLink = {
  label: string;
  path: string;
};

export type SocialLink = {
  label: string;
  href: string;
};
