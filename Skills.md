# Skills Reference — Ergoweb QA Agentic Solution

This file documents all Claude Code slash commands (skills) available in this repository.
Skills are defined in `.claude/commands/` and invoked with `/skill-name` in a Claude Code session.

---

## Available Skills

### `/analyze-site`

**File**: `.claude/commands/analyze-site.md`

Crawls the live ergoweb.com site and produces an updated `site.config.json`.

**Use when**:
- Onboarding to this repo for the first time
- The site has been redesigned and selectors may have changed
- `expectedNavItems` or other config fields are stale

**What it does**:
1. Navigates to the site URL in `site.config.json`
2. Extracts nav links, form fields, meta description, key headings
3. Checks for contact form, responsive viewport, HTTPS
4. Outputs a refreshed `site.config.json` JSON block
5. Reports any issues found (missing meta, broken links, etc.)

**Output**: Updated JSON + issues checklist

---

### `/generate-full-suite`

**File**: `.claude/commands/generate-full-suite.md`

Analyzes ergoweb.com from scratch and generates a complete POM + test suite.

**Use when**:
- The site has significantly changed and tests are outdated
- New pages have been discovered that need coverage
- Starting fresh after a major framework update

**What it does**:
1. Reads `site.config.json`
2. Fetches homepage and all linked pages
3. Plans page object classes for each discovered page
4. Writes `src/pages/<name>.page.ts` files with real selectors
5. Writes test files across all categories (smoke, nav, forms, functional, visual, responsive)
6. Updates `src/fixtures/site.fixture.ts`
7. Runs `npx tsc --noEmit` to verify TypeScript
8. Reports: pages analyzed, classes created, tests written, anything blocked

**Output**: Written files + summary report

---

### `/run-smoke`

**File**: `.claude/commands/run-smoke.md`

Runs `@smoke` tests and displays a clean pass/fail summary table.

**Use when**:
- Verifying the site is up before running a full suite
- Quick sanity check after changes
- CI pipeline status check

**What it does**:
1. Runs `npm run test:smoke`
2. Parses `test-results/results.json`
3. Displays a formatted table: test name, status, duration
4. For failures: shows error message and suggested fix
5. Mirrors the test exit code

**Output**: Summary table in terminal

---

### `/update-baseline`

**File**: `.claude/commands/update-baseline.md`

Captures fresh visual regression baseline screenshots.

**Use when**:
- The site's design has intentionally changed
- Adding new visual tests for the first time
- After changing viewport sizes in `playwright.config.ts`
- Onboarding a new site repo

**What it does**:
1. Runs `npm run baseline` (`playwright test --grep @visual --update-snapshots`)
2. Lists all updated files in `__snapshots__/`
3. Reminds you to review screenshots before committing

**Important**: Always visually review new baselines before `git add __snapshots__/`.

**Output**: List of updated snapshot files + review reminder

---

### `/generate-report`

**File**: `.claude/commands/generate-report.md`

Parses test results and displays a structured summary.

**Use when**:
- After a full test run to get a clean overview
- Preparing a QA report for stakeholders
- Investigating failures across multiple suites

**What it does**:
1. Parses `test-results/results.json`
2. Displays a suite-level summary table (total, passed, failed, flaky per tag)
3. Lists all failed tests with error messages
4. Lists flaky tests with suggestions
5. Opens the HTML report (`playwright-report/index.html`)

**Output**: Summary table + failure details

---

## Custom Subagents

Subagents are specialized Claude instances defined in `.claude/agents/`. Claude automatically delegates to them when appropriate.

### `site-analyzer`

**File**: `.claude/agents/site-analyzer.md`

Crawls a live website to produce a fully-populated `site.config.json`. Invoked automatically when Claude needs to discover or refresh site configuration.

### `test-generator`

**File**: `.claude/agents/test-generator.md`

Generates site-specific Playwright test files for features not covered by the generic suites. Invoked when Claude writes new tests for a specific page or feature.

---

## Adding a New Skill

1. Create `.claude/commands/<skill-name>.md`
2. Write the implementation as a step-by-step prompt for Claude
3. Register it in the skill system by documenting it here in `Skills.md`
4. Update the skill table in `CLAUDE.md` and `AGENTS.md`

Skill files are Markdown. Claude reads them when the slash command is invoked and follows the instructions as a prompt.
