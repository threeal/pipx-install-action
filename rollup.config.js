import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/action/main.ts",
  output: {
    dir: "dist/action",
    entryFileNames: "[name].bundle.mjs",
  },
  plugins: [nodeResolve(), typescript()],
};
