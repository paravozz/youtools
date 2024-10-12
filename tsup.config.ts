import { defineConfig } from "tsup";


export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  format: ["esm"],
  sourcemap: true,
  minify: false,
  target: "esnext",
  outDir: "dist",
  env: {
    TRANSPILE_URL: process.env.TRANSPILE_URL!,
  }
});
