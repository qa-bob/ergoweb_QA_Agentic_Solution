---
paths:
  - "tests/**/*.spec.ts"
  - "tests/**/*.ts"
---

# Testing Conventions

- Import `test` and `expect` from `@fixtures/site.fixture`, never from `@playwright/test` directly
- Tag every test with at least one: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- Use `test.describe('Description @tag', ...)` for the suite and `test('description @tag', ...)` for individual tests
- Use `test.beforeEach` for navigation shared across tests in a describe block
- Never submit forms — test field interaction and validation only
- Never hardcode `https://ergoweb.com` — use `siteConfig.url` or the `baseURL` from Playwright config
- Never call `page.waitForTimeout()` — use `page.waitForSelector()`, `page.waitForLoadState()`, or Playwright auto-waiting
- Keep tests independent — each test should be runnable in isolation without relying on prior test state
- Use soft assertions (`expect.soft()`) only when checking multiple related conditions that should all be reported
- For flaky external resources (CDN, third-party scripts), filter them from console error assertions rather than failing
