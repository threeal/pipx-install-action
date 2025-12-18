import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: false,
    coverage: {
      enabled: true,
      reporter: ["text"],
      thresholds: { 100: true },
    },
  },
});
