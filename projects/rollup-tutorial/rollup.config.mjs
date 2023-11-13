import webworker from "rollup-plugin-webworker";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import { defineConfig } from "rollup";

const config = defineConfig({
  input: "index.ts",
  output: [
    {
      file: "dist/out.js",
      format: "esm",
    },
  ],
  plugins: [
    commonjs(),
    typescript(),
    webworker({
      filter: /!worker$/,
      inline: true,
      useTerser: true,
      useTs: true,
      tsPlugin: typescript()
    })
  ],
});

export default config;
