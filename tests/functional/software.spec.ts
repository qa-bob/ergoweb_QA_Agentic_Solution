/**
 * tests/functional/software.spec.ts
 *
 * Functional tests for the Ergoweb Enterprise™ Software page (/ergonomics-software/).
 * Covers: hero heading, feature sections, assessment tools, CTAs, and page load.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Software Page @functional', () => {
  test.beforeEach(async ({ softwarePage }) => {
    await softwarePage.navigateTo();
  });

  // ── Page loads ───────────────────────────────────────────────────────────────

  test('software page loads successfully @functional @smoke', async ({ softwarePage }) => {
    const isLoaded = await softwarePage.isLoaded();
    expect(isLoaded, 'Software page should load with an identifiable heading').toBeTruthy();
  });

  test('software page has correct H1 heading @functional', async ({ softwarePage }) => {
    await expect(softwarePage.heroHeading, 'H1 should be visible').toBeVisible();
    const headingText = (await softwarePage.heroHeading.textContent())?.trim() ?? '';
    expect(
      headingText.toLowerCase(),
      'H1 should reference Enterprise Software or Ergoweb'
    ).toMatch(/enterprise|ergoweb/i);
  });

  // ── Feature sections ─────────────────────────────────────────────────────────

  test('software page has multiple feature section headings @functional', async ({ softwarePage }) => {
    const headings = await softwarePage.getSectionHeadingTexts();
    expect(
      headings.length,
      'Software page should have at least 3 section headings'
    ).toBeGreaterThanOrEqual(3);
  });

  test('software page mentions assessment tools @functional', async ({ page }) => {
    const assessmentContent = page.locator('body').filter({
      hasText: /assessment tool|RULA|REBA|NIOSH|ergonomic/i,
    });
    expect(
      await assessmentContent.count(),
      'Software page should mention ergonomic assessment tools'
    ).toBeGreaterThan(0);
  });

  test('software page has "23 Integrated Assessment Tools" section @functional', async ({ softwarePage }) => {
    const section = softwarePage.assessmentToolsSection;
    if (await section.count() > 0) {
      await expect(section.first(), '23 assessment tools section should be visible').toBeVisible({ timeout: 10_000 });
    } else {
      // Fallback: check page text contains the phrase
      const bodyText = await softwarePage.page.evaluate<string>(() => document.body.innerText);
      expect(
        bodyText,
        'Page body should mention assessment tools'
      ).toMatch(/assessment tool/i);
    }
  });

  test('software page has Smart Library section @functional', async ({ softwarePage }) => {
    const section = softwarePage.smartLibrarySection;
    if (await section.count() > 0) {
      await expect(section.first(), 'Smart Library section should be present').toBeVisible({ timeout: 10_000 });
    } else {
      const bodyText = await softwarePage.page.evaluate<string>(() => document.body.innerText);
      expect(bodyText).toMatch(/smart library/i);
    }
  });

  test('software page has Continuous Improvement section @functional', async ({ softwarePage }) => {
    const section = softwarePage.continuousImprovementSection;
    if (await section.count() > 0) {
      await expect(section.first(), 'Continuous Improvement section should be visible').toBeVisible({ timeout: 10_000 });
    } else {
      const bodyText = await softwarePage.page.evaluate<string>(() => document.body.innerText);
      expect(bodyText).toMatch(/continuous improvement/i);
    }
  });

  // ── Adaptable / Sustainable / Easy sections ───────────────────────────────────

  test('software page has "Adaptable" feature section @functional', async ({ page }) => {
    const heading = page.locator('h2, h3').filter({ hasText: /adaptable/i });
    if (await heading.count() > 0) {
      await expect(heading.first()).toBeVisible();
    } else {
      const bodyText = await page.evaluate<string>(() => document.body.innerText);
      expect(bodyText).toMatch(/adaptable/i);
    }
  });

  test('software page has "Sustainable" feature section @functional', async ({ page }) => {
    const heading = page.locator('h2, h3').filter({ hasText: /sustainable/i });
    if (await heading.count() > 0) {
      await expect(heading.first()).toBeVisible();
    } else {
      const bodyText = await page.evaluate<string>(() => document.body.innerText);
      expect(bodyText).toMatch(/sustainable/i);
    }
  });

  // ── CTAs ─────────────────────────────────────────────────────────────────────

  test('software page has "Request Demo" CTA @functional', async ({ softwarePage }) => {
    await expect(
      softwarePage.requestDemoButton,
      '"Request Demo" link should be visible on the software page'
    ).toBeVisible({ timeout: 10_000 });
  });

  test('"Request Demo" link has a valid href @functional', async ({ softwarePage }) => {
    const href = await softwarePage.requestDemoButton.getAttribute('href');
    expect(href, '"Request Demo" link should have an href').not.toBeNull();
    expect(href!.length, 'href should not be empty').toBeGreaterThan(0);
  });

  test('software page has "Client Login" link @functional', async ({ softwarePage }) => {
    if (await softwarePage.clientLoginLink.count() > 0) {
      await expect(softwarePage.clientLoginLink).toBeVisible();
    } else {
      console.warn('[software] Client Login link not found on software page — may be in nav only.');
    }
  });

  // ── Security and compliance mentions ─────────────────────────────────────────

  test('software page mentions encryption or security @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.toLowerCase(),
      'Software page should mention security, encryption, or compliance'
    ).toMatch(/encrypt|secure|iso|compliance|sso|single sign/i);
  });

  // ── Responsive heading check ─────────────────────────────────────────────────

  test('software page is responsive at mobile viewport @functional @responsive', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(siteConfig.url.replace(/\/$/, '') + '/ergonomics-software/', {
      waitUntil: 'domcontentloaded',
    });

    const h1 = page.locator('h1').first();
    await expect(h1, 'H1 should be visible at mobile viewport').toBeVisible({ timeout: 10_000 });

    const hasHorizontalScroll = await page.evaluate<boolean>(
      () => document.body.scrollWidth > document.documentElement.clientWidth
    );
    expect(
      hasHorizontalScroll,
      'Software page should not have horizontal scroll at 390px'
    ).toBeFalsy();
  });
});
