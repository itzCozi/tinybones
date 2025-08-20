export type SiteConfiguration = {
  title: string;
  description: string;
  href: string;
  author: string;
  locale: string;
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
