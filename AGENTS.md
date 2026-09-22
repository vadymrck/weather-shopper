# Test Automation Framework Guidance

Use these conventions when adding or changing automated tests. Apply them proportionally: prefer simple, explicit code until repeated needs justify a new abstraction.

## Design principles

- Treat test code as production code: reliable, readable, maintainable, isolated, and fast.
- Keep tests focused on user and business behaviour, not implementation details.
- Keep each test independent. It must not rely on execution order, another test's data, or shared in-memory state.
- Use TypeScript contracts for shared data. Prefer `interface` for named object shapes and `type` for unions and composition.

## Test and page-object structure

- Use `test.step()` for meaningful business-flow stages, not individual clicks or assertions.
- Tests state _what_ is being verified. Page objects encapsulate _how_ the UI is used.
- Keep test control flow and expected values explicit. Calculate expected business values in pure `utils/` helpers before a verification step; assertion methods should verify supplied expectations and return `Promise<void>`.
- Do not hide cross-page readiness assertions inside an action. After an action opens or redirects to another UI surface, explicitly assert the destination page object's readiness in the spec.
- Group every page object with `// Locators`, `// Actions`, and `// Assertions` comments.
- Keep page-object locators `private`; expose only readable, user-meaningful public actions, reads, and assertions.
- Reuse a private page-object locator when the same UI element is used by both actions and assertions.
- Prefer composition and small focused page objects over inheritance or large base classes.
- Keep pure parsing, selection, and calculation logic in `utils/`, separate from Playwright UI code.

Example:

```ts
const expectedTotal = calculateProductTotal(selectedItems);

await test.step("Verify the cart before payment", async () => {
  await productsPage.openCart();
  await cartPage.toBeOpen();
  await cartPage.toHaveItems(selectedItems);
  await cartPage.toHaveTotal(expectedTotal);
});

await test.step("Submit payment and verify the successful confirmation", async () => {
  await cartPage.openStripeCheckout();
  await stripeCheckout.toBeOpen();
  await stripeCheckout.toHavePaymentTotal(expectedTotal);
  await stripeCheckout.completePayment(validPayment);
});
```

## Locators and synchronization

- Prefer user-facing locators: `getByRole`, `getByLabel`, `getByPlaceholder`, then `getByText`.
- Use `getByTestId` when the application intentionally provides stable test hooks.
- Use scoped CSS only when semantic locators are unavailable; avoid XPath, deep selectors, positional selectors, and arbitrary `nth-child` paths.
- Rely on Playwright auto-waiting and web-first assertions. Do not use `waitForTimeout()` or `networkidle` as synchronization.
- Assert a meaningful readiness marker after navigation or an external UI transition. Keep that assertion visible in the spec and owned by the destination page object.

## Test data and dependencies

- Do not hard-code volatile UI data. Read dynamic data at runtime when there is no controlled source of truth.
- Use factories when test data becomes complex or needs consistent defaults and variations. Generate unique data when tests create shared backend records.
- Use custom fixtures only for genuinely repeated, typed infrastructure such as page objects, API clients, authenticated state, or lifecycle-managed test data.
- Prefer API setup and cleanup over UI setup when controlled application APIs exist.
- Mock third-party dependencies in fast deterministic tests. Keep a small, clearly separated set of live sandbox integration tests for critical external journeys.

## Agent browser exploration

- Use Playwright CLI for targeted browser exploration when UI behaviour, requirements, locators, or a failure cause is unknown. It is not a replacement for the Playwright test runner.
- Use `npx playwright test` to validate repository tests. First read the relevant spec, page object, and report artifacts; use browser exploration only when they do not answer the question.
- Do not invent UI text, selectors, URLs, or expected behaviour. Use the requirement, existing code, and observed runtime evidence; report any mismatch explicitly.
- Prefer snapshots, semantic element references, screenshots, traces, console logs, and network inspection over coordinate-based interaction or generated selectors.
- After exploring a flow, implement or update the page object and spec, then run the smallest relevant test. Do not commit generated code without refactoring it to these conventions.
- Prefer Playwright CLI for coding agents working in a repository. Use an available browser MCP when persistent, tool-based exploration or an existing authenticated browser session is specifically required.
- Do not submit payments, create external records, send notifications, or perform other external state changes during exploratory work unless the user explicitly authorizes that action or requests the relevant test execution.

## Failure triage

- Read the terminal failure and report artifacts before changing code. Classify the outcome as a test defect, application defect, external-dependency issue, or expected domain outcome.
- Preserve the evidence and fix the root cause. Do not hide failures with hard waits, arbitrary timeout increases, weaker assertions, retries, or silent skips.
- Do not claim a run passed when an external dependency or application defect prevents it. State the observed outcome, the evidence available, and the remaining risk.

## Execution, tagging, and CI

- Keep tags purposeful and few, for example `@smoke`, `@regression`, `@api`, and `@payment`. Use the existing tag style consistently.
- Configure base URL, browsers, reporters, retries, and timeouts centrally in `playwright.config.ts`.
- Enable parallel execution only after browser state and backend data are isolated. Start with a small worker count and measure reliability.
- Do not use retries to hide deterministic defects or documented application failures. Investigate the cause and use retries only for a justified transient-risk policy.
- Run formatting, linting, and type checking on every pull request. Run live external E2E tests separately from required quality gates when their dependencies are unstable or costly.
- Preserve failure diagnostics: HTML report, screenshot, trace, and video where appropriate.

## Changes and validation

- For non-trivial work, follow this sequence: inspect relevant code, explore unknown behaviour, make the smallest scoped change, run the affected test, run `npm run check`, then report results and remaining risks.
- Run the smallest relevant tests during development, then run `npm run check` before handoff.
- Update `README.md` when commands, coverage, prerequisites, CI behaviour, or material design decisions change.
- Keep changes scoped; do not introduce frameworks, patterns, or dependencies without a current need.
- Do not commit, push, or change external services unless explicitly asked.
