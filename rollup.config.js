import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import ts from "rollup-plugin-ts";

export default [
  {
    input: "src/lib.ts",
    output: {
      dir: "dist",
    },
    plugins: [
      ts({
        tsconfig: (config) => ({ ...config, declaration: true }),
        transpileOnly: true,
      }),
    ],
    external: [
      "cache-action",
      "catched-error-message",
      "gha-utils",
      "node:child_process",
      "os",
      "path",
    ],
  },
  {
    input: "src/main.ts",
    output: {
      dir: "dist",
      entryFileNames: "[name].mjs",
    },
    plugins: [nodeResolve(), typescript()],
  },
];
