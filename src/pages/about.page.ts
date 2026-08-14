import { type Page, type Locator } from '@playwright/test';
import type { SiteConfig } from '../types/site-config.types';
import { BasePage } from './base.page';

export class AboutPage extends BasePage {
  readonly heroHeading: Locator;
  readonly pageContent: Locator;
  readonly contactLink: Locator;
  readonly bodyText: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.heroHeading = page.locator('h1').first();
    this.pageContent = page.locator('main, .entry-content, article, [role="main"]').first();
    this.contactLink = page.getByRole('link', { name: /contact/i }).first();
    this.bodyText = page.locator('p').first();
  }

  async navigateTo(): Promise<void> {
    const aboutUrl = this.url.replace(/\/$/, '') + '/about-ergoweb-2/';
    await this.page.goto(aboutUrl, { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  async getPageText(): Promise<string> {
    return this.page.evaluate<string>(() => document.body.innerText);
  }

  async isLoaded(): Promise<boolean> {
    try {
      const headingCount = await this.heroHeading.count();
      if (headingCount === 0) return false;
      const bodyContent = await this.getPageText();
      return bodyContent.trim().length > 100;
    } catch {
      return false;
    }
  }
}
