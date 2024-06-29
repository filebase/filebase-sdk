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
    "blockstore-core",
    "blockstore-fs",
    "datastore-core",
    "p-queue",
  ],
  dts: true,
  format: ["cjs"],
  clean: true,
});
