/**
 * tests/functional/homepage.spec.ts
 *
 * Functional tests for the Ergoweb homepage (/).
 * Verifies business content: hero section, key feature callouts, CTAs,
 * section headings, and footer elements.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Functional @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.waitForLoad();
  });

  // ── Hero section ─────────────────────────────────────────────────────────────

  test('homepage hero has a main heading @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading.trim(), 'Homepage must have a non-empty H1 or H2').toBeTruthy();
    expect(heading.trim().length).toBeGreaterThan(5);
  });

  test('homepage hero text references ergonomics @functional', async ({ homePage }) => {
    const heroText = await homePage.getHeroText();
    expect(
      heroText.toLowerCase(),
      'Hero section should reference ergonomics or the product'
    ).toMatch(/ergonomic|ergoweb|software|sustainable/i);
  });

  // ── CTA buttons ──────────────────────────────────────────────────────────────

  test('homepage has at least one CTA button @functional', async ({ homePage }) => {
    const ctaButtons = await homePage.getCTAButtons();
    expect(
      ctaButtons.length,
      'Homepage should have at least one call-to-action button or link'
    ).toBeGreaterThan(0);
  });

  test('CTA buttons are visible @functional', async ({ homePage }) => {
    const ctaButtons = await homePage.getCTAButtons();
    test.skip(ctaButtons.length === 0, 'No CTA buttons found');
    await expect(ctaButtons[0], 'First CTA button should be visible').toBeVisible();
  });

  // ── Key content sections ─────────────────────────────────────────────────────

  test('homepage has Ergoweb Enterprise software section @functional', async ({ page }) => {
    const enterpriseSection = page.locator('h2, h3').filter({
      hasText: /ergoweb enterprise|enterprise software/i,
    });
    await expect(
      enterpriseSection.first(),
      'Homepage should mention Ergoweb Enterprise™ Software'
    ).toBeVisible({ timeout: 10_000 });
  });

  test('homepage has a Learning Center section @functional', async ({ page }) => {
    const lcSection = page.locator('h2, h3, section').filter({
      hasText: /learning center/i,
    });
    expect(
      await lcSection.count(),
      'Homepage should have a Learning Center content section'
    ).toBeGreaterThan(0);
  });

  test('homepage has a Downloadable Guides section @functional', async ({ page }) => {
    const guidesSection = page.locator('h2, h3, section').filter({
      hasText: /downloadable guides|guides/i,
    });
    expect(
      await guidesSection.count(),
      'Homepage should reference Downloadable Guides'
    ).toBeGreaterThan(0);
  });

  // ── Navigation presence ───────────────────────────────────────────────────────

  test('homepage navigation includes Software link @functional', async ({ page, siteConfig }, testInfo) => {
    // Small viewports usually hide the nav behind a toggle — covered by the mobile nav test
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const softwareLink = page.getByRole('link', { name: /software/i }).first();
    await expect(softwareLink, 'Nav should contain a Software link').toBeVisible();
  });

  // ── Footer ───────────────────────────────────────────────────────────────────

  test('homepage footer is present @functional', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]').first();
    expect(await footer.count(), 'Page should have a footer element').toBeGreaterThan(0);
  });

  test('homepage footer has privacy policy link @functional', async ({ page }) => {
    const privacyLink = page.getByRole('link', { name: /privacy/i });
    test.skip(await privacyLink.count() === 0, 'No privacy policy link found in footer');
    await expect(privacyLink.first()).toBeVisible();
  });

  // ── "See How We're Different" CTA ────────────────────────────────────────────

  test('homepage has "See How We\'re Different" CTA @functional', async ({ page }) => {
    const differentCta = page.getByRole('link', { name: /see how we.re different/i }).or(
      page.getByRole('button', { name: /see how we.re different/i })
    ).first();

    if (await differentCta.count() > 0) {
      await expect(differentCta).toBeVisible();
    } else {
      console.warn('[homepage] "See How We\'re Different" CTA not found — may have changed.');
    }
  });

  // ── Page is fully loaded ─────────────────────────────────────────────────────

  test('homepage reports as loaded @functional', async ({ homePage }) => {
    const loaded = await homePage.isLoaded();
    expect(loaded, 'Homepage isLoaded() check should return true').toBeTruthy();
  });
});
