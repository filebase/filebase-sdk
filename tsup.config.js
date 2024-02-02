import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.js'],
  splitting: false,
  sourcemap: false,
  noExternal: ['@ipld/car', '@helia/car', '@helia/unixfs', 'blockstore-fs', 'axios', '@aws-sdk/client-s3', '@aws-sdk/lib-storage', 'uuid'],
  dts: true,
  format: ['cjs', 'esm'],
  clean: true,
})
