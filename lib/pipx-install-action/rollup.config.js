import ts from "rollup-plugin-ts";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
  },
  plugins: [ts({ transpileOnly: true })],
  external: [
    "cache-action",
    "catched-error-message",
    "gha-utils",
    "node:child_process",
    "os",
    "path",
  ],
};
