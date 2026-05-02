import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules', '.next', 'dist'],
    globals: false,
    environment: 'node',
  },
  esbuild: {
    // tsconfig.json sets jsx to "preserve" for the Next.js compiler.
    // Vitest needs an actual JSX transform to parse TSX modules pulled in
    // transitively (e.g. data/faq.tsx via lib/jsonLd.ts).
    jsx: 'automatic',
  },
})
