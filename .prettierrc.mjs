// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
  "plugins": ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  "trailingComma": "all",
  "singleQuote": false,
  "insertPragma": true,
  "requirePragma": true,
  "embeddedLanguageFormatting": "auto",
  "bracketSameLine": true,
  "bracketSpacing": true,
  "arrowParens": "always",
  "jsxSingleQuote": false,
  "quoteProps": "as-needed",
  "proseWrap": "always",
  "useTabs": false,
  "printWidth": 100,
  "tabWidth": 2,
  "singleAttributePerLine": true,
  "semi": true,
  "experimentalTernaries": true,
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro",
        "astroAllowShorthand": false
      }
    }
  ]
}
