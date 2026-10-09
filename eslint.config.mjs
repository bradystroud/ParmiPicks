import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: [
      "**/node_modules",
      "**/dist",
      "tina/__generated__",
      ".next",
      // Bundled TinaCMS admin app, emitted into public/ by `tinacms build`.
      "public/admin",
    ],
  },
  js.configs.recommended,
  ...typescriptEslint.configs["flat/recommended"],
];
