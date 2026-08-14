# Ergoweb QA Agentic Solution

Playwright + TypeScript regression test suite for [ergoweb.com](https://ergoweb.com), built with Claude Code's agentic QA workflow.

---

## Purpose

This repository provides a comprehensive GUI, functional, and regression test suite for **Ergoweb** — an ergonomics software and services company. Every user-accessible feature of ergoweb.com is covered without account creation, login, or form submission.

**Tech Stack**: Playwright · TypeScript · Page Object Model (POM) · OOP · GitHub Actions · Claude Code

---

## Development Environment Setup

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20 or later |
| npm | 9 or later |
| Git | any recent version |

### Install

```bash
# Clone the repository
git clone <repo-url>
cd ergoweb_QA_Agentic_Solution

# Install Node dependencies
npm install

# Install Playwright browser binaries
npx playwright install
```

### Environment Variables

Copy `.env.example` to `.env` and set overrides as needed:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `SITE_URL` | value from `site.config.json` | Override the target URL for testing |
| `CI` | unset | Set to `1` in CI to enable retries and stricter settings |

---

## Running Tests

```bash
# All tests (headless, all browsers)
npm test

# Single suite by tag
npm run test:smoke          # @smoke — site is up and serving
npm run test:navigation     # @navigation — links and routing
npm run test:forms          # @forms — form fields, validation
npm run test:visual         # @visual — screenshot regression
npm run test:responsive     # @responsive — layout at mobile/tablet/desktop

# Headed mode (visible browser window)
npm run test:headed

# Update visual baselines after intentional design changes
npm run baseline

# Code quality
npm run typecheck           # TypeScript strict check
npm run lint                # ESLint

# View last test report
npm run report
```

---

## Architecture

This project applies two foundational patterns: **Page Object Model** and core **Object-Oriented Programming** principles.

### Page Object Model (POM)

Every page or major section of the site has a corresponding class in `src/pages/`. Tests never interact with the DOM directly — they call methods on page objects.

```
Test file                Page object class          Browser DOM
────────────             ──────────────────         ───────────
software.spec.ts  ──►   SoftwarePage               ergoweb.com/ergonomics-software/
                            .heroHeading            ◄── readonly Locator
                            .requestDemoButton      ◄── readonly Locator
                            .clickRequestDemo()     ── click + waitForLoad
```

### OOP Principles Applied

| Principle | How it manifests |
|-----------|-----------------|
| **Inheritance** | All page objects extend `BasePage`, inheriting `navigate()`, `waitForLoad()`, `isResponsive()`, `takeScreenshot()` |
| **Encapsulation** | Locators and DOM queries are private implementation details; tests see only clean public methods |
| **Abstraction** | Tests call `software.clickRequestDemo()` — not `page.locator('a[href*="request"]').click()` |
| **Single Responsibility** | Each class models exactly one page or section; `BasePage` handles only shared plumbing |

### Class Hierarchy

```
BasePage
  ├── HomePage            (/)
  ├── NavigationPage      (nav inspection across all pages)
  ├── ContactFormPage     (/contact-us/)
  ├── SoftwarePage        (/ergonomics-software/)
  ├── LearningCenterPage  (/ergoweb-learning-center/)
  └── AboutPage           (/about-ergoweb-2/)
```

### Test Tags

| Tag | When to use |
|-----|-------------|
| `@smoke` | Site loads, title present, no console errors |
| `@navigation` | Nav links, routing, menus, mobile hamburger |
| `@forms` | Form fields, validation, no-submission |
| `@functional` | Business features: software, learning center, guides |
| `@visual` | Screenshot regression with `toHaveScreenshot()` |
| `@responsive` | Viewport-specific layout checks |

---

## Claude Code Agents & Skills

This repo is configured for **Claude Code** agentic execution. Claude reads `CLAUDE.md` (which imports `AGENTS.md`) for project instructions on every session.

### Slash Commands (Skills)

| Command | Description |
|---------|-------------|
| `/analyze-site` | Crawl ergoweb.com and refresh `site.config.json` |
| `/generate-full-suite` | Re-analyze site and regenerate all POM classes + tests |
| `/run-smoke` | Run smoke tests and show a clean pass/fail summary |
| `/update-baseline` | Capture new visual regression baselines |
| `/generate-report` | Parse `test-results/results.json` and display a test summary |

### Custom Subagents (`.claude/agents/`)

| Agent | Triggered when |
|-------|----------------|
| `site-analyzer` | Discovering or refreshing `site.config.json` |
| `test-generator` | Writing new site-specific tests for discovered features |

### Key Config Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Claude Code project instructions (imports `AGENTS.md`) |
| `AGENTS.md` | Shared instructions for all AI coding agents |
| `Skills.md` | Documentation of all slash commands |
| `.claude/settings.json` | Claude Code project settings and permissions |
| `.claude/rules/` | Path-scoped coding rules loaded on demand |
| `.claude/agents/` | Custom subagent definitions |
| `.claude/commands/` | Slash command implementations |
| `.claude/hooks/pre-test.sh` | Runs before any test command to verify site reachability |

---

## .github Folder

| Path | Purpose |
|------|---------|
| `workflows/playwright.yml` | CI pipeline — runs full test suite on push and PR |
| `CONTRIBUTING.md` | Contributor guidelines and workflow |
| `PULL_REQUEST_TEMPLATE.md` | PR checklist template |
| `ISSUE_TEMPLATE/bug_report.yml` | Structured bug report form |
| `ISSUE_TEMPLATE/feature_request.yml` | Feature request form |
| `copilot-instructions.md` | GitHub Copilot workspace instructions |

---

## Project Structure

```
ergoweb_QA_Agentic_Solution/
├── site.config.json              # Target site URL, name, flags
├── playwright.config.ts          # Browser projects: desktop, mobile, tablet
├── global-setup.ts               # Pre-suite reachability check
├── tsconfig.json                 # TypeScript strict config with path aliases
├── package.json                  # Scripts and devDependencies
├── CLAUDE.md                     # Claude Code instructions (imports AGENTS.md)
├── AGENTS.md                     # Shared AI agent instructions
├── Skills.md                     # Slash command / skill reference
│
├── .claude/
│   ├── settings.json             # Claude Code project settings
│   ├── agents/
│   │   ├── site-analyzer.md      # Subagent: crawl site → site.config.json
│   │   └── test-generator.md     # Subagent: generate site-specific tests
│   ├── commands/
│   │   ├── analyze-site.md       # /analyze-site implementation
│   │   ├── generate-full-suite.md
│   │   ├── generate-report.md
│   │   ├── run-smoke.md
│   │   └── update-baseline.md
│   ├── hooks/
│   │   └── pre-test.sh           # Site reachability check
│   └── rules/
│       ├── testing.md            # Testing conventions (scoped to tests/**)
│       ├── typescript.md         # TypeScript conventions
│       └── playwright-pom.md     # POM rules (scoped to src/pages/**)
│
├── src/
│   ├── pages/                    # Page Object Model classes
│   │   ├── base.page.ts
│   │   ├── home.page.ts
│   │   ├── navigation.page.ts
│   │   ├── contact.page.ts
│   │   ├── software.page.ts
│   │   ├── learning-center.page.ts
│   │   └── about.page.ts
│   ├── fixtures/
│   │   └── site.fixture.ts       # Custom Playwright fixtures
│   ├── utils/
│   │   ├── link-checker.ts
│   │   └── visual-helper.ts
│   └── types/
│       └── site-config.types.ts
│
├── tests/
│   ├── smoke/
│   │   └── site-availability.spec.ts
│   ├── navigation/
│   │   └── nav-links.spec.ts
│   ├── forms/
│   │   └── contact-form.spec.ts
│   ├── functional/
│   │   ├── homepage.spec.ts
│   │   ├── software.spec.ts
│   │   └── learning-center.spec.ts
│   ├── visual/
│   │   └── visual-regression.spec.ts
│   └── responsive/
│       └── layout.spec.ts
│
└── .github/
    ├── workflows/
    │   └── playwright.yml
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.yml
    │   └── feature_request.yml
    ├── PULL_REQUEST_TEMPLATE.md
    ├── CONTRIBUTING.md
    └── copilot-instructions.md
```

---

## Contributor Rules

> These rules apply to both human contributors and AI coding agents.

1. **Never submit a form** — test field interactions and validation only
2. **Never hardcode a URL** — always use `baseURL` from Playwright config (sourced from `site.config.json`)
3. **Never put `expect()` inside a page object** — assertions belong in test files only
4. **Always tag tests** with at least one `@tag` (see Tag table above)
5. **Extend `BasePage`** for every new page object class
6. **One class per page** in `src/pages/` — no combining unrelated pages
7. **Use Playwright auto-waiting** — never `page.waitForTimeout()`
8. **Run `npm run typecheck`** before pushing — zero TypeScript errors required
9. **Run `/run-smoke` via Claude Code** after changes to verify nothing broke
10. **No `any` type** without an explicit `// eslint-disable` comment explaining why
11. Follow the detailed steps in [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md)

---

*Part of the Phoenix Startup QA Agentic Solutions project. Tests Ergoweb at [https://ergoweb.com](https://ergoweb.com).*
