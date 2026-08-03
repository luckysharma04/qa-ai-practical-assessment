# AI Prompts — Automation and Debugging

Record of Cursor AI sessions for Playwright UI/API automation implementation, failure analysis, and fixes.

**Application:** Practice Software Testing Toolshop v5.0  
**Framework:** `PrismStructure/` (Playwright + Prism pattern)  
**Date:** 03 August 2026

---

## Entry 1 — Prism framework scaffold

### Problem

No automation codebase existed. Assessment requires Playwright Prism structure with Pages, Tests, API layer, Fixtures, Utils, Config, and Reports.

### Prompt

Design a scalable Playwright Prism Framework (JavaScript). Folder structure: Pages, Tests, API, Fixtures, Utils, Data, Config, Reports. Explain every folder. Then generate Page Object classes for Home, Login, Registration, Product, Cart, Checkout, Invoice, Profile.

### AI Response

Created `PrismStructure/` scaffold: `BasePage`, page objects per screen, `testFixtures.js`, `playwright.config.js`, `Config/env.js`, `Config/constants.js`, empty API client/services, and `FRAMEWORK.md`. Page objects use `data-test` locators and reusable methods (`fillBillingAddress`, `addToCart`, etc.).

### Fix

Iterative hardening during smoke run — see entries below. Core scaffold remained; page objects gained wizard-step helpers and DOM-click fallbacks.

### Lessons Learned

- Scaffold first, but **probe the live SUT** before locking flows — AI defaults (routes, endpoints) may not match Toolshop behavior.
- Keep assertions out of page objects; centralize in `Utils/assertions.js` later.

---

## Entry 2 — UI smoke suite

### Problem

Need runnable `@Smoke` UI coverage: registration, login, search, cart, checkout, invoice, logout — with fixtures, tags, and failure screenshots.

### Prompt

Generate Playwright automation — Smoke Suite only. Scenarios: Registration, Login, Product Search, Add to Cart, Checkout, Invoice Verification, Logout. Use Page Objects, Fixtures, Tags, reusable methods, proper assertions, screenshots on failure.

### AI Response

Added 7 smoke specs under `Tests/ui/smoke/`, extended `uiFlows.js` (`loginAs`, `addFirstProductToCart`, `completeCodCheckout`, `signOut`), configured `screenshot: 'only-on-failure'` in Playwright config.

### Fix

Multiple debugging cycles for registration, cart, checkout, and invoice (Entries 3–8). Smoke suite stabilized after page object and flow corrections.

### Lessons Learned

- Split smoke into **focused specs** (not one mega E2E) for faster isolation when debugging.
- `uiFlows` reduces duplication between smoke and regression.

---

## Entry 3 — Double-confirm invoice (UI-AC2)

### Problem

`invoice.spec.js` failed: invoice not created or finish button not interactable. Assessment requires **two Confirm/Finish clicks** before invoice appears in My Invoices.

### Prompt

(Implicit during smoke debugging) How to automate invoice when UI requires two Confirm clicks?

### AI Response

Added `CheckoutPage.confirmInvoiceTwice()`: wait for enabled `finish`, DOM `evaluate()` click twice, optional wait for `POST /invoices`. Documented in risk analysis as R-03.

### Fix

```javascript
// CheckoutPage.js — click via DOM when wizard hides button
await this.page.evaluate(() => {
  const finish = document.querySelector('[data-test="finish"]');
  if (finish && !finish.disabled) finish.click();
});
```
Called twice in `confirmInvoiceTwice()` after `goToConfirmStep()`.

### Lessons Learned

- Playwright `click()` fails when element is **hidden** in multi-step wizard — DOM click is acceptable last resort with enabled-state guard.
- Encode assessment-specific UX (double confirm) in **one page object method**, not scattered in specs.

---

## Entry 4 — Empty cart on checkout

### Problem

`cart.spec.js` / checkout specs failed: checkout showed zero line items after navigation.

### Prompt

(Debug session) Cart empty on checkout — investigate routing and timing.

### AI Response

Identified that navigating to `/cart` before checkout can clear or desync session cart. Recommended verifying line items on `/checkout` only.

### Fix

- `CheckoutPage.openWithItems()` — open checkout and wait for `product-title`
- Removed pre-checkout `/cart` visits from happy-path flows
- `uiFlows.navigateToCheckout()` goes directly to checkout after add-to-cart

### Lessons Learned

- **Route semantics matter** — not every cart URL is equivalent to checkout state on this SUT.
- Wait for **line-item locators** on the page that matters for the assertion.

---

## Entry 5 — Checkout billing wizard (`proceed-3` disabled)

### Problem

Checkout stuck at billing step: `proceed-3` remained disabled; COD step never reached.

### Prompt

(Debug) Checkout wizard proceed button disabled after filling billing.

### AI Response

Billing step requires all mandatory fields including `house_number`. Wizard enables next step only after valid Angular form state.

### Fix

- `fillBillingAddress()` fills `house_number` (default `'42'`)
- Tab out of postal code field to trigger validation
- `goToBillingStep()` + `clickEnabledProceed()` sequence in `CheckoutPage`

### Lessons Learned

- Read **all** required fields from UI (not only assessment PDF billing sample).
- `force: true` fill helps hidden wizard fields; still need blur/tab for validation.

---

## Entry 6 — Registration failures

### Problem

`registration.spec.js` failed: validation errors on phone or password rejected as leaked/common.

### Prompt

(Debug) Registration form rejects test data.

### AI Response

SUT validates phone as numeric-only and rejects common passwords. Suggested Faker + timestamp-based unique passwords.

### Fix

- `dataGenerator.registrationUser()` — numeric phone, `RegPass_{timestamp}!xY9` style passwords
- Country select via `selectOption` for registration address

### Lessons Learned

- Public apps may use **password breach checks** — never reuse `welcome01` for new registrations.
- Align generated data with **visible validation rules** (phone format).

---

## Entry 7 — Logout / session menu

### Problem

`logout.spec.js` flaky: sign-out control not found or menu not opening.

### Prompt

(Debug) Logout locator flakiness on account page.

### AI Response

Logout lives inside `nav-menu` user dropdown, not a top-level sign-out link.

### Fix

`uiFlows.signOut()` — open `nav-menu`, click `nav-sign-out` via DOM click if needed. `session.spec.js` uses `expectProtectedRouteBlocked()` after logout.

### Lessons Learned

- Inspect **authenticated chrome** separately from guest nav.
- Session tests should assert **protected route redirect** to login, not only nav text.

---

## Entry 8 — API cart add 404

### Problem

API cart regression failed: `POST /carts/{id}/items` returned **404**.

### Prompt

Generate Playwright API automation (full E2E). AI initially used Swagger-assumed `/items` sub-resource.

### AI Response

Implemented `CartApi.addProduct()`; first version used `/carts/{id}/items` pattern common in REST designs.

### Fix

Live API probe showed correct contract:

```
POST /carts/{cartId}
Body: { "product_id": "<id>", "quantity": <n> }
```

Updated `CartApi.js` and all specs using cart add.

### Lessons Learned

- **Never trust AI or Swagger alone** — probe with `curl` or Playwright request in a one-off script.
- Document verified endpoints in `project-info.md` Automation Strategy.

---

## Entry 9 — API cart quantity assertion

### Problem

`TC-API-RG-002` failed: expected quantity `3`, received `4` after “update” to 3.

### Prompt

(Debug) Cart quantity mismatch after second add.

### AI Response

Assumed second POST **sets** quantity; API actually **increments**.

### Fix

- Test design: add `1`, then add `2`, expect total `3`
- `updateProductQuantity()` documented as increment alias in `CartApi.js`

### Lessons Learned

- Assert **documented API behavior**, not assumed REST semantics (PUT vs additive POST).
- Name methods to match behavior (`addProduct` vs `setQuantity`).

---

## Entry 10 — API cleanup limitations

### Problem

E2E flow requested “delete test data” — user deletion failed.

### Prompt

Delete test data if possible (API E2E).

### AI Response

Implemented `DELETE /carts/{cartId}` in flow cleanup.

### Fix

`DELETE /users/me` returns **403** on public SUT. Cleanup scope limited to cart delete (`204`). Registered users remain in shared DB (acceptable for assessment).

### Lessons Learned

- Define **teardown scope** explicitly when full delete is not API-supported.
- Unique emails limit collision impact on shared DB.

---

## Entry 11 — Weak assertions across suites

### Problem

Specs used `toBeTruthy()`, `response.ok()`, and count-only checks — insufficient for assessment validation quality.

### Prompt

Review all assertions. Replace weak assertions with strong ones: `expect()`, status, response body, schema, UI/cart/invoice/token validation.

### AI Response

Added `API/schemas/apiSchemas.js`, `Utils/apiAssertions.js`, expanded `Utils/assertions.js`. Updated all 20 specs to use centralized validators.

### Fix

| Issue | Adjustment |
|-------|------------|
| Confirm step line items hidden | `attachedOnly` mode in `expectCheckoutLineItems` |
| Search: first row not matching term | Assert **any** product name contains search term |
| Profile pre-fills billing | `expectBillingFieldsPopulated` vs exact street match |
| Invoice negative 422 body | `expectErrorBody` handles Laravel field error arrays |
| Cart total hidden on confirm | `toBeAttached()` for totals on wizard last step |

### Lessons Learned

- **Schema validators** catch AI-generated happy-path code that misses required fields.
- UI wizard steps break `toBeVisible()` — use attached + domain helpers.

---

## Entry 12 — API invoice negative error body

### Problem

`invoice-negative.spec.js` failed: `expectErrorBody` did not recognize Laravel validation shape (`billing_street: ["required"]`).

### Prompt

(Part of assertion hardening run)

### AI Response

Original checker only looked for `message` or `errors` object.

### Fix

Extended `expectErrorBody` to accept top-level field keys with array error messages.

### Lessons Learned

- Error contract varies by framework — support **multiple rejection shapes** in one helper.

---

## Entry 13 — Tag-based execution

### Problem

Smoke/regression and UI/API runs required manual path + grep combinations; easy to run wrong subset on Windows.

### Prompt

Apply tags `@Smoke`, `@Regression`, `@UI`, `@API`. Organize execution by tags.

### AI Response

Tagged all describe blocks; added Playwright projects `ui-smoke`, `ui-regression`, `api-smoke`, `api-regression`; npm scripts per project.

### Fix

`playwright.config.js` grep lookaheads: `(?=.*@UI)(?=.*@Smoke)`, etc.

### Lessons Learned

- **Projects + npm scripts** beat complex CLI grep on Windows.
- Layer tag (`@UI`/`@API`) orthogonal to tier tag (`@Smoke`/`@Regression`).

---

## Entry 14 — Reporting and failure artifacts

### Problem

Assessment needs execution evidence: HTML, JSON, JUnit, screenshots, video, trace, failure logs.

### Prompt

Configure HTML, JSON, JUnit reports, screenshots, videos, trace, failure logs. Explain how to run reports.

### AI Response

Updated `playwright.config.js` reporters; `retain-on-failure` for video/trace; custom `FailureLogReporter`; `scripts/copy-reports.js`; `npm run report` / `report:copy`.

### Fix

Failure logs write `Reports/failure-logs/failures.log` + `failures.json` with attachment paths for HTML report cross-reference.

### Lessons Learned

- Configure reporters **once** in config — every run produces submission artifacts.
- Custom failure log helps when CI cannot open HTML interactively.

---

## Entry 15 — UI regression suite

### Problem

Need 5 regression specs reusing page objects without duplicating login/checkout flows.

### Prompt

Generate Regression Suite. Use existing Page Objects. Avoid duplication. Reusable utilities. One spec file at a time.

### AI Response

Created 5 specs (`TC-UI-RG-001`–`005`), `Utils/assertions.js` auth/checkout helpers, extended `uiFlows` (`registerAndLogin`, `navigateToCheckoutWithItems`).

### Fix

`checkout-negative.spec.js` uses `expectInvoiceCountStable` after single confirm; `catalog-cart.spec.js` timeout increased to 120s for multi-product scout.

### Lessons Learned

- Regression negatives should assert **state unchanged** (invoice count), not only error messages.
- Long-running UI flows need explicit `test.setTimeout`.

---

## Debugging workflow (reference)

| Step | Action |
|------|--------|
| 1 | Re-run single spec: `npx playwright test <path>` |
| 2 | Open HTML report: `npm run report` |
| 3 | Inspect trace / screenshot / video on failure |
| 4 | Read `Reports/failure-logs/failures.log` |
| 5 | Focused Cursor session with error + snippet (not full secrets) |
| 6 | Minimal fix → re-run smoke for affected layer → full regression |

---

## Key files modified during debugging

| File | Typical fix |
|------|-------------|
| `Pages/CheckoutPage.js` | Wizard steps, double confirm, billing fields |
| `Pages/LoginPage.js` | Wait for email field on open |
| `Pages/ProductPage.js` | Wait for `POST /carts`, in-stock scout |
| `Utils/uiFlows.js` | Route strategy, sign-out menu |
| `Utils/dataGenerator.js` | Password/phone rules |
| `API/services/CartApi.js` | Correct add endpoint, increment behavior |
| `Utils/apiAssertions.js` / `API/schemas/` | Strong validation |
| `playwright.config.js` | Tags, reporters, artifacts |

---

## Automation status (post-debugging)

| Suite | Specs | Typical result |
|-------|-------|----------------|
| API smoke | 3 | Pass |
| API regression | 5 | Pass |
| UI smoke | 7 | Pass (invoice may be slow/flaky on public SUT) |
| UI regression | 5 | Pass |

Run before submission:

```bash
npm run test:smoke
npm run test:regression
npm run report:copy
```

---

*Related: `ai-prompts/test-design.md` (case design), `ai-prompts/test-data.md` (data issues), `project-info.md` (Debugging section).*
