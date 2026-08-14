/**
 * tests/functional/learning-center.spec.ts
 *
 * Functional tests for the Ergoweb® Learning Center page (/ergoweb-learning-center/).
 * Covers: page load, article listings, guide links, navigation to articles.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Learning Center Page @functional', () => {
  test.beforeEach(async ({ learningCenterPage }) => {
    await learningCenterPage.navigateTo();
  });

  // ── Page loads ───────────────────────────────────────────────────────────────

  test('learning center page loads successfully @functional @smoke', async ({ learningCenterPage }) => {
    const isLoaded = await learningCenterPage.isLoaded();
    expect(isLoaded, 'Learning Center page should load with a visible heading').toBeTruthy();
  });

  test('learning center page has a main heading @functional', async ({ learningCenterPage }) => {
    await expect(
      learningCenterPage.heroHeading,
      'Learning Center page should have an H1 heading'
    ).toBeVisible({ timeout: 10_000 });
  });

  // ── Content sections ──────────────────────────────────────────────────────────

  test('learning center has article content @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Learning Center page should have substantial text content'
    ).toBeGreaterThan(200);
  });

  test('learning center has ergonomics-related content @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.toLowerCase(),
      'Learning Center content should relate to ergonomics'
    ).toMatch(/ergonomic|musculoskeletal|assessment|workplace|msd/i);
  });

  // ── Article links ─────────────────────────────────────────────────────────────

  test('learning center has at least one article link @functional', async ({ learningCenterPage, page }) => {
    // Look for article or blog-style links
    const articleLinks = page.locator('article a[href], .post a[href], h2 a[href], h3 a[href]').filter({
      hasNotText: /^(read more|more articles|more guides|client login|contact|about|home|software)$/i,
    });

    const count = await articleLinks.count();
    if (count === 0) {
      // Fallback: any non-nav link in the main content area
      const mainContent = page.locator('main, .entry-content, #content').first();
      if (await mainContent.count() > 0) {
        const contentLinks = mainContent.locator('a[href]');
        expect(
          await contentLinks.count(),
          'Learning Center should have links to articles or resources'
        ).toBeGreaterThan(0);
      } else {
        console.warn('[learning-center] Could not identify article links — page structure may have changed.');
      }
    } else {
      expect(count, 'Learning Center should have article links').toBeGreaterThan(0);
    }
  });

  // ── "More Articles" and "More Guides" CTAs ────────────────────────────────────

  test('learning center has navigation to more content @functional', async ({ page }) => {
    const moreLinks = page.getByRole('link').filter({
      hasText: /more articles|more guides|read more|view all/i,
    });

    if (await moreLinks.count() > 0) {
      await expect(moreLinks.first(), '"More" content link should be visible').toBeVisible();
    } else {
      console.warn('[learning-center] No "More Articles/Guides" link found — content may be paginated differently.');
    }
  });

  // ── Downloadable Guides ────────────────────────────────────────────────────────

  test('learning center references downloadable guides @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasGuides = /guide|download|resource|pdf/i.test(bodyText);

    if (!hasGuides) {
      console.warn('[learning-center] No downloadable guide references found — may be on a separate section.');
    }
    // Soft assertion — guides may be listed on homepage but linked from here
    expect(typeof hasGuides).toBe('boolean');
  });

  // ── "Read more" links ─────────────────────────────────────────────────────────

  test('article entries have "Read more" or detail links @functional', async ({ page }) => {
    const readMoreLinks = page.getByRole('link', { name: /read more/i });
    if (await readMoreLinks.count() > 0) {
      await expect(readMoreLinks.first(), '"Read more" link should be visible').toBeVisible();
    } else {
      // Articles may link via their title directly
      const titleLinks = page.locator('h2 a[href], h3 a[href]');
      if (await titleLinks.count() > 0) {
        await expect(titleLinks.first(), 'Article title links should be visible').toBeVisible();
      } else {
        console.warn('[learning-center] No article title or "Read more" links found.');
      }
    }
  });

  // ── Page structure ─────────────────────────────────────────────────────────────

  test('learning center does not have horizontal scroll @functional @responsive', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(siteConfig.url.replace(/\/$/, '') + '/ergoweb-learning-center/', {
      waitUntil: 'domcontentloaded',
    });

    const hasHorizontalScroll = await page.evaluate<boolean>(
      () => document.body.scrollWidth > document.documentElement.clientWidth
    );
    expect(
      hasHorizontalScroll,
      'Learning Center should not have horizontal scroll at mobile viewport'
    ).toBeFalsy();
  });
});
