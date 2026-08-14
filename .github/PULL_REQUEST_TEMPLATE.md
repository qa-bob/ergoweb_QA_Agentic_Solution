## Summary

<!-- One sentence: what does this PR add or change? -->

## Test Coverage

<!-- What pages, features, or scenarios does this cover? -->

- Pages tested:
- Test categories added/modified:
- Total new tests:

## Checklist

- [ ] `npm run typecheck` passes (zero TypeScript errors)
- [ ] `npm run lint` passes
- [ ] `npm run test:smoke` passes
- [ ] New page objects extend `BasePage`
- [ ] No `expect()` calls inside page object methods
- [ ] No hardcoded URLs (all use `baseURL` or `siteConfig.url`)
- [ ] No `page.waitForTimeout()` calls
- [ ] All new tests have at least one `@tag`
- [ ] No forms are submitted
- [ ] New page objects added to `src/fixtures/site.fixture.ts`
- [ ] Visual baselines updated if `@visual` tests were added or changed

## Notes for Reviewers

<!-- Anything unusual about selectors, site behavior, or test approach? -->
