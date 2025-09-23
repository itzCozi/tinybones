/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  theme: {
    setTheme: (theme: "auto" | "dark" | "light") => void;
    getTheme: () => "auto" | "dark" | "light";
    getSystemTheme: () => "light" | "dark";
    getDefaultTheme: () => "auto" | "dark" | "light";
  };
}

// Fallback ambient declarations for editor/TS happy state in .astro files
// The Astro language server provides the real types at build/dev time.
declare const Astro: any;

// Some libraries ship Astro components without TypeScript types. Provide a module shim.
declare module "lucide-astro";
