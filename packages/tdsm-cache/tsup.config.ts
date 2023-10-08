import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    sourcemap: true,
    clean: true,
    splitting: false,
    dts: true,
    shims: true,
    platform: 'node',
    minifyIdentifiers: true,
    minifySyntax: true,
    outDir: 'lib',
    target: 'es2015',
    tsconfig: './tsconfig.json'
});