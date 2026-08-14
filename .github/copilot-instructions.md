# GitHub Copilot Instructions — Ergoweb QA Agentic Solution

> These instructions apply to GitHub Copilot in VS Code and GitHub Copilot Chat for this repository.
> They mirror the rules in AGENTS.md and CLAUDE.md.

---

## Project Context

This is a **Playwright + TypeScript** test suite for [https://ergoweb.com](https://ergoweb.com).

- **Pattern**: Page Object Model (POM) + OOP inheritance
- **Language**: TypeScript strict mode
- **Test runner**: Playwright
- **Fixture system**: Custom — import `test` and `expect` from `@fixtures/site.fixture`, not from `@playwright/test`

---

## Code Generation Rules

### Page Objects (`src/pages/*.page.ts`)

Always follow this pattern:

```typescript
import { type Page, type Locator } from '@playwright/test';
import type { SiteConfig } from '@types/site-config.types';
import { BasePage } from './base.page';

export class ExamplePage extends BasePage {
  readonly heading: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading = page.locator('h1').first();
    this.ctaButton = page.getByRole('link', { name: /get started/i });
  }

  async navigateTo(): Promise<void> {
    await this.page.goto(`${this.url}/path`, { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }
}
```

- Extend `BasePage` always
- Declare locators as `readonly Locator` on the class
- Methods = user actions, never assertions
- No `expect()` inside page objects

### Test Files (`tests/**/*.spec.ts`)

```typescript
import { test, expect } from '@fixtures/site.fixture';

test.describe('Feature @tag', () => {
  test('description @tag', async ({ pageName }) => {
    await pageName.navigateTo();
    await expect(pageName.heading).toBeVisible();
  });
});
```

- Import from `@fixtures/site.fixture` — never from `@playwright/test` directly
- Tag every test with `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, or `@responsive`
- Never submit forms
- Never hardcode URLs

### Selectors (in priority order)

1. `page.getByRole(...)` — preferred
2. `page.getByLabel(...)` — for form fields
3. `page.getByText(...)` — for content
4. `page.locator('[data-testid="..."]')`
5. CSS class selectors only if semantic
6. Avoid `.nth()` and absolute XPath

---

## Absolute Don'ts

- Do NOT call `page.waitForTimeout()` — use Playwright auto-waiting
- Do NOT hardcode `https://ergoweb.com` in tests — use `siteConfig.url` or `baseURL`
- Do NOT click Submit buttons on forms
- Do NOT use the `any` type without justification
- Do NOT put `expect()` calls inside `src/pages/` classes

---

## Site Structure

| Page | URL Path | Page Object Class |
|------|----------|------------------|
| Homepage | `/` | `HomePage` |
| Software | `/ergonomics-software/` | `SoftwarePage` |
| Learning Center | `/ergoweb-learning-center/` | `LearningCenterPage` |
| Contact | `/contact-us/` | `ContactFormPage` |
| About | `/about-ergoweb-2/` | `AboutPage` |
