//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  endOfLine: "lf",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,
  importOrder: [
    "/^(?!.*\\.css).*/",
    "^react$",
    "^react-dom$",
    "^@supabase/supabase-js$",
    "^@tanstack/react-router$",
    "^@tanstack/react-query$",
    "^@tanstack/react-table$",
    "^@tanstack/react-form$",
    "<THIRD_PARTY_MODULES>",
    "#/*",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    "prettier-plugin-sql",
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports",
  ],
  overrides: [
    {
      files: ["*.sql"],
      options: {
        language: "postgresql",
        keywordCase: "lower",
      },
    },
  ],
  tailwindStylesheet: "src/styles.css",
  tailwindFunctions: ["cn", "cva"],
}

export default config
