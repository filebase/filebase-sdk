import { defineConfig } from "tsup";
import { nodeModulesPolyfillPlugin } from "esbuild-plugins-node-modules-polyfill";

export default defineConfig([
  {
    entry: ["src/index.js"],
    format: ["cjs", "esm"],
    target: "node18",
    outDir: "dist/node",
    dts: true,
    clean: true,
    sourcemap: true,
    minify: true,
    noExternal: ["ipns"],
  },
  {
    entry: ["src/index.js"],
    format: ["esm"],
    target: "es2018",
    outDir: "dist/browser",
    dts: true,
    clean: true,
    sourcemap: true,
    minify: true,
    noExternal: ["ipns"],
    esbuildPlugins: [
      nodeModulesPolyfillPlugin({
        modules: {
          crypto: true,
        },
      }),
    ],
  },
]);
