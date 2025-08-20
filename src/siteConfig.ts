import type {
  SiteConfiguration,
  NavigationLinks,
  SocialLink,
} from '@/types.ts';

export const SITE: SiteConfiguration = {
  title: 'Cats with power tools',
  description: 'Collaborative programmer blog',
  href: 'https://blog.exploit.cat/',
  author: 'Cooper Ransom',
  locale: 'en-US',
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/cooperransom',
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/cooperransom',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/cooperransom',
  },
];

export const NAV_LINKS: NavigationLinks = {
  about: {
    path: '/about',
    label: 'About',
  },
  blog: {
    path: '/blog',
    label: 'Blog',
  },
  projects: {
    path: '/projects',
    label: 'Projects',
  },
};
