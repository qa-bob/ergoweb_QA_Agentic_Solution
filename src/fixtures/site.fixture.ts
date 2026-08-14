/**
 * src/fixtures/site.fixture.ts
 *
 * Extends Playwright's base `test` with pre-constructed page objects and the
 * loaded site config.  All test files should import {test, expect} from here
 * instead of from '@playwright/test' directly.
 *
 * Usage in test files:
 *   import { test, expect } from '@fixtures/site.fixture';
 */

import { test as base, expect } from '@playwright/test';
import { loadSiteConfig, type SiteConfig } from '../types/site-config.types';
import { HomePage } from '@pages/home.page';
import { NavigationPage } from '@pages/navigation.page';
import { ContactFormPage } from '@pages/contact.page';
import { SoftwarePage } from '@pages/software.page';
import { LearningCenterPage } from '@pages/learning-center.page';
import { AboutPage } from '@pages/about.page';

// ── Fixture type definitions ─────────────────────────────────────────────────

export interface Fixtures {
  /** Fully resolved site configuration loaded from site.config.json */
  siteConfig: SiteConfig;
  /** Pre-navigated HomePage page object */
  homePage: HomePage;
  /** NavigationPage page object (does not auto-navigate) */
  navigationPage: NavigationPage;
  /** ContactFormPage page object (does not auto-navigate) */
  contactPage: ContactFormPage;
  /** SoftwarePage page object (does not auto-navigate) */
  softwarePage: SoftwarePage;
  /** LearningCenterPage page object (does not auto-navigate) */
  learningCenterPage: LearningCenterPage;
  /** AboutPage page object (does not auto-navigate) */
  aboutPage: AboutPage;
}

// ── Extended test object ─────────────────────────────────────────────────────

export const test = base.extend<Fixtures>({
  /**
   * siteConfig — loaded once per worker from site.config.json.
   * Shared across all fixtures in the same test.
   */
  siteConfig: async ({}, use) => {
    const config = loadSiteConfig();
    await use(config);
  },

  /**
   * homePage — constructs HomePage and navigates to the site root.
   * Waits for domcontentloaded before handing control to the test.
   */
  homePage: async ({ page, siteConfig }, use) => {
    const homePage = new HomePage(page, siteConfig);
    await homePage.navigate();
    await use(homePage);
  },

  /**
   * navigationPage — constructs NavigationPage without navigating.
   * Tests that need to be on a specific page should call navigate() themselves.
   */
  navigationPage: async ({ page, siteConfig }, use) => {
    const navigationPage = new NavigationPage(page, siteConfig);
    await use(navigationPage);
  },

  /**
   * contactPage — constructs ContactFormPage without navigating.
   * Tests should navigate to the appropriate page first.
   */
  contactPage: async ({ page, siteConfig }, use) => {
    const contactPage = new ContactFormPage(page, siteConfig);
    await use(contactPage);
  },

  /**
   * softwarePage — constructs SoftwarePage without navigating.
   * Call softwarePage.navigateTo() in your test or beforeEach.
   */
  softwarePage: async ({ page, siteConfig }, use) => {
    const softwarePage = new SoftwarePage(page, siteConfig);
    await use(softwarePage);
  },

  /**
   * learningCenterPage — constructs LearningCenterPage without navigating.
   * Call learningCenterPage.navigateTo() in your test or beforeEach.
   */
  learningCenterPage: async ({ page, siteConfig }, use) => {
    const learningCenterPage = new LearningCenterPage(page, siteConfig);
    await use(learningCenterPage);
  },

  /**
   * aboutPage — constructs AboutPage without navigating.
   * Call aboutPage.navigateTo() in your test or beforeEach.
   */
  aboutPage: async ({ page, siteConfig }, use) => {
    const aboutPage = new AboutPage(page, siteConfig);
    await use(aboutPage);
  },
});

// Re-export expect so tests only need one import source
export { expect };
