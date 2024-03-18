import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.js"],
  splitting: false,
  sourcemap: false,
  noExternal: [
    "@ipld/car",
    "@helia/car",
    "@helia/unixfs",
    "@helia/mfs",
    "blockstore-level",
    "datastore-core",
    "p-queue",
  ],
  dts: true,
  format: ["cjs"],
  clean: true,
});
