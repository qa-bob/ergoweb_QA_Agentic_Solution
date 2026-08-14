---
paths:
  - "src/pages/**/*.ts"
---

# Page Object Model Rules

- Every page object class must extend `BasePage` from `./base.page`
- All DOM locators must be declared as `readonly Locator` properties on the class
- Set locators in the constructor using `this.page.locator(...)`, `this.page.getByRole(...)`, etc.
- Methods on page objects represent **user actions** only: navigate, click, fill, open, close
- Never call `expect()` inside a page object — assertions live in test files
- Never call `page.waitForTimeout()` — use `this.waitForLoad()` from BasePage or Playwright auto-waiting
- Constructor signature: `constructor(page: Page, config: SiteConfig)`
- Call `super(page, config)` as the first line of every constructor
- Use the `this.url` property (from BasePage) as the base for `page.goto()` calls
- Selector priority: `getByRole` > `getByLabel` > `getByText` > `data-testid` > semantic CSS class > position-based
- One class per page or major section — do not combine unrelated pages into one class
