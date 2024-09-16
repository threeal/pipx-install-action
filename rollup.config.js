import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/main.ts",
  output: {
    dir: "dist",
    entryFileNames: "[name].mjs",
  },
  plugins: [nodeResolve(), typescript()],
};
