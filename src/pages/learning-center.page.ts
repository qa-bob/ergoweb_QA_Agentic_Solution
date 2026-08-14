import { type Page, type Locator } from '@playwright/test';
import type { SiteConfig } from '../types/site-config.types';
import { BasePage } from './base.page';

export class LearningCenterPage extends BasePage {
  readonly heroHeading: Locator;
  readonly articleLinks: Locator;
  readonly guideLinks: Locator;
  readonly moreArticlesButton: Locator;
  readonly moreGuidesButton: Locator;
  readonly contentSections: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.heroHeading = page.locator('h1').first();

    this.articleLinks = page.locator('article a[href], .post a[href], .entry a[href]').filter({
      hasNotText: /read more|more articles|more guides/i,
    });

    this.guideLinks = page.locator('a').filter({
      hasText: /guide|download|pdf/i,
    });

    this.moreArticlesButton = page.getByRole('link', { name: /more articles/i }).first();
    this.moreGuidesButton = page.getByRole('link', { name: /more guides/i }).first();

    this.contentSections = page.locator('section, .entry-content > div, article').filter({
      hasText: /.{50,}/,
    });
  }

  async navigateTo(): Promise<void> {
    const lcUrl = this.url.replace(/\/$/, '') + '/ergoweb-learning-center/';
    await this.page.goto(lcUrl, { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  async getArticleCount(): Promise<number> {
    return this.articleLinks.count();
  }

  async getGuideCount(): Promise<number> {
    return this.guideLinks.count();
  }

  async clickFirstArticle(): Promise<string> {
    const firstLink = this.articleLinks.first();
    const href = (await firstLink.getAttribute('href')) ?? '';
    await firstLink.click();
    await this.page.waitForLoadState('domcontentloaded');
    return href;
  }

  async isLoaded(): Promise<boolean> {
    try {
      const headingCount = await this.heroHeading.count();
      return headingCount > 0;
    } catch {
      return false;
    }
  }
}
