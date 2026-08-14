# Contributing to Ergoweb QA Agentic Solution

Thank you for contributing! This guide covers the workflow, rules, and conventions for working on this test suite.

---

## Golden Rules

These rules apply to **all contributors** — human and AI:

| # | Rule |
|---|------|
| 1 | **Never submit a form** — test fields and validation only |
| 2 | **Never hardcode a URL** — use `baseURL` or `site.config.json` |
| 3 | **Never put `expect()` inside a page object** |
| 4 | **Every test must have at least one tag** (`@smoke`, `@navigation`, etc.) |
| 5 | **Every page object must extend `BasePage`** |
| 6 | **TypeScript must compile cleanly** before any PR is opened |
| 7 | **Use Playwright auto-waiting** — never `page.waitForTimeout()` |
| 8 | **No `any` type** without an explicit comment explaining why |

---

## Contribution Workflow

### 1. Branch

Create a branch from `main`:

```bash
git checkout -b test/add-software-page-tests
```

Branch naming conventions:

| Type | Pattern | Example |
|------|---------|---------|
| New tests | `test/<description>` | `test/add-learning-center-tests` |
| Bug fix | `fix/<description>` | `fix/flaky-nav-test` |
| Page object | `feat/pom-<page>` | `feat/pom-about-page` |
| Framework | `chore/<description>` | `chore/upgrade-playwright` |

### 2. Develop

Before writing tests:
- Read `site.config.json` for site URL and flags
- Fetch the live page with Claude Code (`WebFetch`) to confirm selectors
- Create or update the page object in `src/pages/`
- Add the page object to `src/fixtures/site.fixture.ts`

### 3. Verify

```bash
# TypeScript must be clean
npm run typecheck

# Lint must pass
npm run lint

# Smoke tests must pass
npm run test:smoke

# Run your new tests
npx playwright test tests/functional/software.spec.ts
```

### 4. Open a PR

Fill out the PR template completely. PRs without the checklist filled in will be returned.

---

## Adding a New Page Object

1. **Create** `src/pages/<name>.page.ts`:

```typescript
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@types/site-config.types';

export class ExamplePage extends BasePage {
  readonly heroHeading: Locator;
  readonly primaryCta: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heroHeading = page.locator('h1').first();
    this.primaryCta = page.getByRole('link', { name: /request demo/i });
  }

  async navigateTo(): Promise<void> {
    await this.page.goto(`${this.url}/example-path`, { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }
}
```

2. **Add it to `src/fixtures/site.fixture.ts`**:

```typescript
import { ExamplePage } from '@pages/example.page';

// Add to the Fixtures interface:
examplePage: ExamplePage;

// Add to base.extend:
examplePage: async ({ page, siteConfig }, use) => {
  const examplePage = new ExamplePage(page, siteConfig);
  await use(examplePage);
},
```

3. **Write tests** in `tests/<category>/<name>.spec.ts`

---

## Adding Tests

### File naming

`tests/<category>/<kebab-case-feature>.spec.ts`

### Test structure

```typescript
import { test, expect } from '@fixtures/site.fixture';

test.describe('Feature Name @tag', () => {
  test.beforeEach(async ({ examplePage }) => {
    await examplePage.navigateTo();
  });

  test('hero heading is visible @functional', async ({ examplePage }) => {
    await expect(examplePage.heroHeading).toBeVisible();
  });
});
```

### Selector guidelines

In priority order:

1. `page.getByRole(...)` — most resilient
2. `page.getByLabel(...)` — for form fields
3. `page.getByText(...)` — for content
4. `page.locator('data-testid="..."')` — if available
5. CSS class selectors — only if semantic (`.pricing-card`, `.feature-item`)
6. nth() element selection — last resort

---

## Visual Regression Tests

- Run `/update-baseline` via Claude Code when adding new `@visual` tests
- Always **review baseline screenshots** before committing `__snapshots__/`
- Baselines live in `__snapshots__/` — commit them to make visual diffs work in CI

---

## Using Claude Code

This repo is configured for Claude Code agentic execution. Available slash commands:

| Command | Use when |
|---------|----------|
| `/analyze-site` | Site has changed, refresh `site.config.json` |
| `/generate-full-suite` | Need to regenerate tests from scratch |
| `/run-smoke` | Quick sanity check |
| `/update-baseline` | Visual tests need new baselines |
| `/generate-report` | Get a full test run summary |

See `Skills.md` for full documentation.

---

## Code Review Checklist

When reviewing a PR:

- [ ] Page objects extend `BasePage`
- [ ] No `expect()` inside page object methods
- [ ] No hardcoded URLs
- [ ] No `page.waitForTimeout()` calls
- [ ] All tests are tagged
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] No forms are submitted
- [ ] Selectors are real (not placeholder `[class*="button"]` everywhere)
- [ ] New page objects are added to `site.fixture.ts`
