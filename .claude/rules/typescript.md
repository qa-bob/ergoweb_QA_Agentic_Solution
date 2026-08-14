# TypeScript Conventions

- TypeScript strict mode is enabled — all code must compile with `npx tsc --noEmit` returning exit 0
- No `any` type without an explicit `// eslint-disable-next-line @typescript-eslint/no-explicit-any` comment and a one-line reason
- Use `type` imports for type-only imports: `import type { SiteConfig } from '@types/site-config.types'`
- Prefer `readonly` for class properties that are set only in the constructor
- Use `?: ` for optional properties rather than `| undefined` unions
- Async methods must return `Promise<T>` with an explicit type, not infer it
- Prefer `const` over `let`; never use `var`
- Use path aliases (`@pages/`, `@utils/`, `@types/`, `@fixtures/`) — never relative paths that traverse `..` more than once
- Run `npm run typecheck` before marking any task complete
