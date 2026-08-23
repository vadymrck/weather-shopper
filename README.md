# Weather Shopper UI Automation

Playwright and TypeScript UI tests for the [Weather Shopper](https://weathershopper.pythonanywhere.com/) assignment.

## Prerequisites

- Node.js 20 or later
- npm

## Install and run

```bash
npm ci
npm run test:install-browsers
npm test
```

The suite targets the public application by default. To use another environment, set `BASE_URL`:

```bash
BASE_URL=https://example.test npm test
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm test` | Run the full suite. |
| `npm run test:smoke` | Run the critical end-to-end checkout journey. |
| `npm run test:regression` | Run regression-tagged tests. |
| `npm run test:payment` | Run tests that open Stripe Checkout. |
| `npm run test:headed` | Run tests with a visible browser. |
| `npm run test:report` | Open the latest HTML report. |
| `npm run lint:fix` | Apply safe ESLint fixes. |
| `npm run check` | Run linting and type-checking. |

## Coverage

| Test | Tags | Coverage |
| --- | --- | --- |
| `product-selection.spec.ts` | `@regression` | Selects the least expensive required moisturizer and sunscreen products, then verifies cart lines and totals. |
| `checkout.spec.ts` | `@smoke @regression @payment` | Reads the live temperature, follows the required shopping path, verifies the cart, and requires a successful payment confirmation. |
| `stripe-validation.spec.ts` | `@regression @payment` | Submits a valid-format card with an expired date and verifies that Stripe keeps checkout open and marks the expiry field invalid. |

## Design notes

- Product names and prices are read from the rendered catalogue on every run. The suite does not hard-code today's products or prices.
- When equal-priced qualifying products exist, the first one in visible catalogue order is selected.
- Page objects keep locators, actions, and assertions separate. Tests use `test.step()` for meaningful user-flow stages.
- Locators prefer roles, text, and placeholders. A scoped CSS locator is used only for product cards because the public application exposes no stronger product semantics.
- The suite uses one worker and no global retries. This is deliberate: the target is a public demo with dynamic catalogue data and a hosted payment dependency.
- Failure artifacts include a screenshot, trace, and video. Run `npm run test:report` to inspect them.

## Public demo limitations

Weather Shopper documents an approximately 5% simulated payment-failure rate. The checkout test requires `PAYMENT SUCCESS`; a simulated failure is reported as a failed test rather than retried or masked.

The public catalogue can also vary between runs. If it does not provide an item required by its own tooltip (for example, an SPF-50 sunscreen), the test fails with a clear diagnostic instead of selecting an incorrect substitute.

Stripe field-validation coverage is limited to the expired-card integration path. The suite does not duplicate Stripe's full validation matrix or call Stripe APIs directly.

## Project structure

```text
tests/       Playwright specs
pages/       Page objects
models/      Shared domain types and shopping rules
utils/       Pure price and product-selection helpers
test-data/   Public Stripe test data
```
