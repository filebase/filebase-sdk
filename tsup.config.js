import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.js"],
  format: ["cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: true,
  bundle: true,
  target: ['es2020', 'node21'],
  platform: "neutral",
});
