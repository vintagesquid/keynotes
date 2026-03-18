import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["eslint", "typescript", "unicorn", "jsx-a11y", "vitest", "oxc"],
});
