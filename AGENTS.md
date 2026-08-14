# AGENTS.md — Ergoweb QA Agentic Solution

> Shared instructions for all AI coding agents (Claude Code, GitHub Copilot, Cursor, Devin, etc.).
> Claude Code reads CLAUDE.md, which imports this file. Other tools read this file directly.

---

## Project Summary

This is a **Playwright + TypeScript** regression test suite for [https://ergoweb.com](https://ergoweb.com), an ergonomics software company. It follows the **Page Object Model (POM)** design pattern and is structured for agentic execution.

**Target site**: `https://ergoweb.com`
**Config file**: `site.config.json`
**Test runner**: Playwright (`npx playwright test`)
**Language**: TypeScript (strict mode)

---

## Key Constraints — Never Violate These

- **Do NOT submit any form** — fill fields and test validation only
- **Do NOT create accounts or log in** to ergoweb.com
- **Do NOT hardcode URLs** — always read from `site.config.json` or use `baseURL`
- **Do NOT put assertions (`expect()`) inside page object classes** — tests only
- **Do NOT use `page.waitForTimeout()`** — use Playwright auto-waiting or `waitForSelector`
- **Do NOT use the `any` type** without explicit justification in a comment

---

## Architecture

### Page Object Model (POM)

Every page or major section has a class in `src/pages/`. All classes extend `BasePage`.

```typescript
// Pattern for every page object
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ExamplePage extends BasePage {
  readonly heroHeading: Locator;           // readonly Locator properties
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heroHeading = page.locator('h1'); // real selectors, not placeholders
    this.ctaButton = page.getByRole('link', { name: /request demo/i });
  }

  async clickCta(): Promise<void> {        // user-action methods
    await this.ctaButton.click();
    await this.waitForLoad();
  }
}
```

### Test File Pattern

```typescript
import { test, expect } from '@fixtures/site.fixture';

test.describe('Feature Name @tag', () => {
  test('description of what is verified @tag', async ({ pageName, siteConfig }) => {
    await pageName.navigate();
    // assertions here — never in the page object
    await expect(pageName.heroHeading).toBeVisible();
  });
});
```

### Path Aliases

| Alias | Maps to |
|-------|---------|
| `@pages/*` | `src/pages/*` |
| `@utils/*` | `src/utils/*` |
| `@types/*` | `src/types/*` |
| `@fixtures/*` | `src/fixtures/*` |

---

## Site Structure (ergoweb.com)

| Page | URL | Page Object |
|------|-----|-------------|
| Homepage | `/` | `HomePage` |
| Software | `/ergonomics-software/` | `SoftwarePage` |
| Learning Center | `/ergoweb-learning-center/` | `LearningCenterPage` |
| Contact | `/contact-us/` | `ContactFormPage` |
| About | `/about-ergoweb-2/` | `AboutPage` |
| Client Login | `https://enterprise.ergoweb.com` | external — do not test |

### Navigation Items
`Home`, `Software`, `Ergoweb® Learning Center`, `Contact`, `About`, `Client Login`

### Contact Form Fields
- First name (text, required)
- Last name (text, required)
- Business Email (email, required)
- Comment or Message (textarea, required)
- Submit button: "Submit" — **never click this**

### Key Features to Test (Software page)
- Hero section with "Ergoweb® Enterprise Software" heading
- Feature sections: Adaptable, Sustainable, Easy Implementations
- 23 Integrated Assessment Tools section
- Smart Library section
- Continuous Improvement Workflows section
- "Request Demo" CTA button
- "Client Login" link (external)

---

## Test Tagging System

| Tag | Purpose |
|-----|---------|
| `@smoke` | Site loads, title, HTTPS, no console errors |
| `@navigation` | Nav links, routing, mobile menu |
| `@forms` | Form field inspection, validation |
| `@functional` | Business features and page content |
| `@visual` | Screenshot regression |
| `@responsive` | Mobile/tablet/desktop layout |

---

## Before Writing or Updating Tests

1. Read `site.config.json` to confirm URL and flags
2. Fetch the live page to verify selectors before writing them
3. Create or update the page object in `src/pages/`
4. Write tests using page objects via `@fixtures/site.fixture`
5. Run `npx tsc --noEmit` to confirm TypeScript compiles

---

## Available npm Scripts

```bash
npm test                    # All tests
npm run test:smoke          # @smoke only
npm run test:navigation     # @navigation only
npm run test:forms          # @forms only
npm run test:visual         # @visual only
npm run test:responsive     # @responsive only
npm run baseline            # Update visual snapshots
npm run typecheck           # TypeScript check
npm run lint                # ESLint
```

---

## Claude Code Slash Commands

| Command | Description |
|---------|-------------|
| `/analyze-site` | Crawl ergoweb.com and populate site.config.json |
| `/generate-full-suite` | Generate complete POM + tests from live site |
| `/run-smoke` | Run @smoke suite and display summary |
| `/update-baseline` | Update visual regression baselines |
| `/generate-report` | Display structured test results summary |
