import { type Page, type Locator } from '@playwright/test';
import type { SiteConfig } from '../types/site-config.types';
import { BasePage } from './base.page';

export class SoftwarePage extends BasePage {
  readonly heroHeading: Locator;
  readonly requestDemoButton: Locator;
  readonly clientLoginLink: Locator;

  readonly adaptableSection: Locator;
  readonly sustainableSection: Locator;
  readonly easyImplementationsSection: Locator;
  readonly assessmentToolsSection: Locator;
  readonly smartLibrarySection: Locator;
  readonly continuousImprovementSection: Locator;

  readonly featureSections: Locator;
  readonly sectionHeadings: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.heroHeading = page.locator('h1').first();
    this.requestDemoButton = page.getByRole('link', { name: /request demo/i }).first();
    this.clientLoginLink = page.getByRole('link', { name: /client login/i }).first();

    this.adaptableSection = page.locator('section, div').filter({ hasText: /adaptable/i }).first();
    this.sustainableSection = page.locator('section, div').filter({ hasText: /sustainable/i }).first();
    this.easyImplementationsSection = page.locator('section, div').filter({ hasText: /easy implementations/i }).first();
    this.assessmentToolsSection = page.locator('section, div').filter({ hasText: /23 integrated assessment/i }).first();
    this.smartLibrarySection = page.locator('section, div').filter({ hasText: /smart library/i }).first();
    this.continuousImprovementSection = page.locator('section, div').filter({ hasText: /continuous improvement/i }).first();

    this.featureSections = page.locator('section, article, .entry-content > div');
    this.sectionHeadings = page.locator('h2');
  }

  async navigateTo(): Promise<void> {
    const softwareUrl = this.url.replace(/\/$/, '') + '/ergonomics-software/';
    await this.page.goto(softwareUrl, { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  async clickRequestDemo(): Promise<void> {
    await this.requestDemoButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getSectionHeadingTexts(): Promise<string[]> {
    const headings = await this.sectionHeadings.all();
    const texts: string[] = [];
    for (const h of headings) {
      const text = (await h.textContent())?.trim();
      if (text) texts.push(text);
    }
    return texts;
  }

  async isLoaded(): Promise<boolean> {
    try {
      const headingCount = await this.heroHeading.count();
      if (headingCount === 0) return false;

      const headingText = (await this.heroHeading.textContent())?.trim() ?? '';
      return headingText.toLowerCase().includes('enterprise') || headingText.toLowerCase().includes('ergoweb');
    } catch {
      return false;
    }
  }
}
