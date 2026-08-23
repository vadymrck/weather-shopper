import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import playwright from "eslint-plugin-playwright";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["node_modules/", "playwright-report/", "test-results/"],
  },
  {
    files: ["**/*.ts"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["pages/**/*.ts"],
    plugins: { playwright },
    rules: {
      "playwright/missing-playwright-await": "error",
      "playwright/no-networkidle": "error",
      "playwright/no-wait-for-timeout": "error",
    },
  },
  {
    files: ["tests/**/*.ts"],
    extends: [playwright.configs["flat/recommended"]],
    rules: {
      "playwright/missing-playwright-await": "error",
      "playwright/no-networkidle": "error",
      "playwright/expect-expect": "off",
      "playwright/no-skipped-test": "error",
      "playwright/no-wait-for-timeout": "error",
    },
  },
);
