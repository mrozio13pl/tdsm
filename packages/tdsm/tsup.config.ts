import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/parseOptions.ts'],
    sourcemap: true,
    splitting: false,
    dts: false,
    shims: true,
    platform: 'node',
    minifyIdentifiers: true,
    minifySyntax: true,
    outDir: 'lib',
    target: 'es2015',
    tsconfig: './tsconfig.json'
});