# AI Prompts — Test Design

Record of Cursor AI prompts for test scenario design, manual cases, automation mapping, RTM, and assertion strategy.

**Application:** Practice Software Testing Toolshop v5.0  
**Date:** 03 August 2026

**Mapped artifacts:** `FunctionalTestCase.csv`, `RTM.md`, `PrismStructure/Tests/`, `PrismStructure/API/tests/`

---

## Entry 1 — Assessment analysis (smoke vs regression scope)

### Prompt

Analyze QA Practical Assessment PDF as Senior QA Automation Architect. Do not generate code.

Explain business objective, modules, user journeys, assumptions, risks, UI vs API scope, functional/non-functional requirements, and **suggest Smoke and Regression scope**.

### Summary

Defined Toolshop as B2C ecommerce with core path: browse → auth → cart → COD checkout → double-confirm invoice → My Invoices. Separated **UI scope** (UX, forms, double-confirm, My Invoices UI) from **API scope** (token, cart state machine, invoice contract). Proposed smoke as minimal health checks (login, single add-to-cart, COD + invoice chain, API token/cart/invoice). Proposed regression for full AC1/AC2, multi-item cart, search/filter, auth/checkout negatives. Established **5–8 cases per tier** constraint as governing design rule.

### Validation

- Cross-checked against assessment acceptance criteria (UI-AC1/AC2, API-AC1/AC2).
- Smoke scenarios later folded into `TC-M-001`–`003` and automation IDs.
- UI/API split informed separate automation folders and later `@UI` / `@API` tags.

---

## Entry 2 — Requirement analysis for test design

### Prompt

Act as QA Lead. Create complete Requirement Analysis: Business Flow, Actors, Features, Dependencies, Risks, In/Out of Scope, Test Objectives, Acceptance Criteria, Priority — suitable for `project-info.md`.

### Summary

Documented happy path and exception flows (invalid login, empty cart, bad billing, invalid token). Listed **19 features** with P1/P2 priority. Mapped features to UI-AC1/AC2 and API-AC1/AC2. Defined test objectives TO-01–TO-12 and explicit acceptance criteria tables including assessment invoice POST body. Priority matrix drove which flows became smoke vs regression.

### Validation

- Used as source for manual case preconditions and expected results.
- AC tables directly referenced in RTM rows.
- Double-confirm invoice and COD-only payment encoded as mandatory test design constraints.

---

## Entry 3 — Test plan (strategy by layer and tier)

### Prompt

Create complete Test Plan: Scope, Environment, Entry/Exit Criteria, Smoke Strategy, Regression Strategy, UI Testing Strategy, API Testing Strategy, Data Strategy, Automation Strategy, Defect Management, Deliverables, Execution Plan.

### Summary

Authored `test-plan.md` with smoke scenarios SM-01–SM-08 and regression RG-01–RG-10. Defined UI strategy (POM, double-confirm, My Invoices verification) and API strategy (lifecycle chaining, bearer token, dynamic `cart_id`). Data strategy: unique emails, runtime product/cart IDs. Execution order: manual → API smoke → UI smoke → regression tiers.

### Validation

- Entry criteria (E1–E10) and exit criteria (X1–X14) used as submission checklist.
- Smoke/regression scenario lists aligned with later `TC-M-*` and automation IDs.
- Referenced in `project-info.md` Test Planning section.

---

## Entry 4 — Manual smoke test cases (CSV)

### Prompt

Generate Functional Test Cases in CSV format (Test ID, Module, Scenario, Precondition, Steps, Expected Result, Priority, Smoke/Regression, Positive/Negative/Edge, Status). **Generate only 6 Smoke cases.** No regression yet.

### Summary

Created initial smoke suite **TC-SM-001–006**: catalog load, login, add to cart, COD checkout, double-confirm invoice, My Invoices visibility. All P1, Positive, Smoke. Steps referenced default customer and assessment billing patterns.

### Validation

- Each case mapped to UI-AC2 (purchase) or UI-AC1 (login).
- Later merged into consolidated `TC-M-001`–`003` to meet 8-case cap while preserving coverage.

---

## Entry 5 — Manual regression test cases (CSV)

### Prompt

Generate **8 Regression** test cases covering: Registration, Login, Product Search, Filters, Add to Cart, Cart Update, Checkout, Invoice, Logout. CSV format.

### Summary

Added **TC-RG-001–008** covering registration/profile, search/filters, cart update, full checkout, invoice, and session (login + logout combined). Positive regression paths extending smoke depth.

### Validation

- Covered all user-requested topic areas without duplicating entire smoke E2E in every row.
- Feeds into consolidation step (Entry 8).

---

## Entry 6 — Edge test cases

### Prompt

Generate Edge Test Cases for Registration, Login, Search, Cart, Checkout, Invoice. Focus on unusual user behavior.

### Summary

Produced **TC-ED-*** series: boundary inputs, rapid navigation, special characters in search, max quantity attempts, partial billing, single vs double confirm edge cases. Classified as Edge in CSV.

### Validation

- Edge themes absorbed into regression negatives and boundary data (`test-data/boundary-values.json`) during consolidation.
- Not kept as standalone rows after 5–8 limit enforcement.

---

## Entry 7 — Negative test cases

### Prompt

Generate Negative Test Cases: Invalid Login, Duplicate Registration, Empty Cart Checkout, Invalid Quantity, Network Failure, Invalid Address, Payment Failure, Invoice Failure. CSV format.

### Summary

Produced **TC-NG-*** series covering auth failures, empty cart, invalid billing, single-confirm invoice (no completion), invalid API-style scenarios for manual execution. Classified as Negative in CSV.

### Validation

- **TC-M-007** and **TC-M-008** directly consolidate key negatives (invalid login, duplicate register, empty cart, bad billing, single confirm).
- API negatives implemented in `TC-API-RG-003` and `TC-API-RG-004`.

---

## Entry 8 — Assessment case limit consolidation

### Prompt

There should not be more than **5–8 test cases of each type** (manual + UI + API) which includes `@Smoke` and `@Regression`.

### Summary

Consolidated **28 manual rows** (Smoke + Regression + Edge + Negative) into **8 cases TC-M-001–008**:

| ID | Tier | Type | Design intent |
|----|------|------|----------------|
| TC-M-001 | Smoke | Positive | Catalog load |
| TC-M-002 | Smoke | Positive | Valid login |
| TC-M-003 | Smoke | Positive | E2E: cart + COD + double confirm + My Invoices |
| TC-M-004 | Regression | Positive | Registration + profile |
| TC-M-005 | Regression | Positive | Search, filter, multi-cart, quantity |
| TC-M-006 | Regression | Positive | Login + logout session |
| TC-M-007 | Regression | Negative | Invalid login + duplicate registration |
| TC-M-008 | Regression | Negative | Empty cart, invalid billing, single confirm |

Split: **3 Smoke + 5 Regression = 8** (within 5–8 limit).

### Validation

- Documented in `test-suite-scope.md` as compliant.
- File path: `FunctionalTestCase.csv` (repository root).
- Each consolidated case preserves highest-risk themes from expanded drafts.

---

## Entry 9 — Requirements Traceability Matrix

### Prompt

Create RTM. Columns: Requirement, Acceptance Criteria, Manual Test Case, Smoke Test, Regression Test, API Test, Automation Status.

### Summary

Created `RTM.md` and `RTM.csv` with 28 traceability rows across REQ-01–REQ-10. Defined automation ID scheme:

- Manual: `TC-M-001`–`008`
- UI: `TC-UI-SM-*` / `TC-UI-RG-*` (later implemented as 7 smoke + 5 regression specs)
- API: `TC-API-SM-001`–`003`, `TC-API-RG-001`–`005`

Mapped each acceptance criterion to manual + planned automation with Automation Status column.

### Validation

- UI/API totals each **8 cases** (within limit).
- Spec file names and test titles follow RTM IDs.
- Cross-reference: `RTM.md` Automation ID Reference tables.

---

## Entry 10 — UI smoke automation design

### Prompt

Generate Playwright **Smoke Suite** only: Registration, Login, Product Search, Add to Cart, Checkout, Invoice Verification, Logout. Use Page Objects, Fixtures, Tags, reusable methods, proper assertions, screenshots on failure.

### Summary

Designed **7 UI smoke specs** (expanded from RTM’s 3 smoke IDs by splitting flows for maintainability):

| Spec | ID | Maps to manual |
|------|-----|----------------|
| `auth.spec.js` | TC-UI-SM-LOGIN | TC-M-002 |
| `registration.spec.js` | TC-UI-SM-REG | — |
| `search.spec.js` | TC-UI-SM-SEARCH | TC-M-001 (catalog/search) |
| `cart.spec.js` | TC-UI-SM-CART | TC-M-003 (partial) |
| `checkout.spec.js` | TC-UI-SM-CHECKOUT | TC-M-003 (partial) |
| `invoice.spec.js` | TC-UI-SM-INVOICE | TC-M-003 |
| `logout.spec.js` | TC-UI-SM-LOGOUT | TC-M-006 (partial) |

Tagged `@Smoke`; thin specs via `uiFlows` and page objects. Checkout/invoice encode double-confirm and COD rules.

### Validation

- Executed against live SUT; fixes for cart route, billing `house_number`, finish button DOM click.
- Screenshots on failure via `playwright.config.js`.
- 7 specs within assessment spirit (focused smoke paths; total UI automation 12 with regression).

---

## Entry 11 — UI regression automation design

### Prompt

Generate **Regression Suite**. Use existing Page Objects. Avoid duplication. Reusable utilities. **One spec file at a time.**

### Summary

Designed **5 UI regression specs** aligned to `TC-M-004`–`008`:

| Spec | ID | Coverage |
|------|-----|----------|
| `registration-profile.spec.js` | TC-UI-RG-001 | Register + profile fields |
| `catalog-cart.spec.js` | TC-UI-RG-002 | Search, eco filter, multi-cart, qty |
| `session.spec.js` | TC-UI-RG-003 | Login session + protected routes |
| `auth-negative.spec.js` | TC-UI-RG-004 | Invalid login, duplicate register |
| `checkout-negative.spec.js` | TC-UI-RG-005 | Empty cart, bad billing, single confirm |

Added `Utils/assertions.js` and extended `uiFlows` to avoid duplicated login/register/checkout logic.

### Validation

- 5 regression specs pass after assertion and wait fixes.
- Each maps 1:1 to manual regression cases TC-M-004–008.
- Tagged `@Regression` (later combined with `@UI`).

---

## Entry 12 — API automation test design

### Prompt

Generate Playwright API automation. Flow: Register → Login → Capture Token → Create Cart → Get Products → Add Product → Verify Cart → Generate Invoice → Verify Invoice → Delete test data. Use `APIRequestContext`.

### Summary

Designed **8 API specs** (3 Smoke + 5 Regression):

| Tier | ID | Scenario |
|------|-----|----------|
| Smoke | TC-API-SM-001 | GET /products |
| Smoke | TC-API-SM-002 | Login → `access_token` |
| Smoke | TC-API-SM-003 | Full E2E lifecycle + cart delete |
| Regression | TC-API-RG-001 | POST /users/register |
| Regression | TC-API-RG-002 | Cart add/increment + GET verify |
| Regression | TC-API-RG-003 | Missing/invalid bearer token |
| Regression | TC-API-RG-004 | Invalid invoice payloads |
| Regression | TC-API-RG-005 | Invoice list after COD order |

Service layer + `apiFlows.completePurchaseLifecycle()`. Negative payloads from `test-data/negative-data.json`.

### Validation

- Live probing corrected cart endpoint (`POST /carts/{id}` not `/items`).
- Cart quantity: POST increments (add 1 + add 2 = 3).
- User delete not supported (`403`); cart `DELETE` returns `204`.
- Full API suite: 8/8 passed.

---

## Entry 13 — Assertion and validation design

### Prompt

Review all assertions. Replace weak assertions with strong ones using `expect()`, status, response body, schema, UI validation, invoice validation, cart validation, token validation.

### Summary

Introduced layered validation:

- **`API/schemas/apiSchemas.js`** — JWT, cart item, invoice, product, error body shapes
- **`Utils/apiAssertions.js`** — `expectLoginResponse`, `expectCartBody`, `expectInvoiceListed`, etc.
- **`Utils/assertions.js`** — `expectAccountPage`, `expectCheckoutLineItems`, `expectInvoiceListPage`, `expectProductSearchResults`

Replaced `toBeTruthy()`, `response.ok()`, and sparse count checks across all 20 specs. UI confirm-step uses `attachedOnly` where wizard hides elements; search asserts **any** matching product name.

### Validation

- API invoice-negative: `expectErrorBody` handles Laravel field validation arrays.
- Checkout smoke: `expectBillingFieldsPopulated` when profile pre-fills address.
- Re-ran affected UI/API specs after changes; suites green.

---

## Entry 14 — Tag-based test organization

### Prompt

Apply tags `@Smoke`, `@Regression`, `@UI`, `@API`. Organize execution by tags.

### Summary

Test design execution model: every describe block carries **tier + layer** tags (`@Smoke @UI`, `@Regression @API`, etc.). Four Playwright projects (`ui-smoke`, `ui-regression`, `api-smoke`, `api-regression`) enable isolated runs matching test plan smoke-first gate.

### Validation

- `npx playwright test --list` → 20 tests in 4 projects.
- npm scripts match test plan run commands (`test:ui:smoke`, `test:api:regression`).

---

## Test design summary matrix

| Layer | Smoke | Regression | Total | Manual mapping |
|-------|-------|------------|-------|----------------|
| Manual | 3 | 5 | **8** | TC-M-001–008 |
| UI automation | 7 | 5 | **12** | TC-M-001–008 (+ registration/logout smoke) |
| API automation | 3 | 5 | **8** | API-AC1/AC2 + negatives |

### Design principles applied

1. **AC-first** — every case traces to UI-AC1/AC2 or API-AC1/AC2.
2. **Smoke = minimum viable purchase path** — login, cart, COD, invoice, API chain.
3. **Regression = depth + negatives** — profile, multi-cart, session, auth/checkout failures, API errors.
4. **Consolidation over volume** — edge/negative themes merged into 8 manual cases.
5. **Dynamic data** — no hard-coded cart/product IDs in API design.
6. **Assessment UX rules** — double confirm, COD only, verify on checkout not cart page.
7. **Strong assertions** — status + schema + domain validators, not boolean truthiness.

---

## Outstanding manual validation

| Item | Action |
|------|--------|
| `FunctionalTestCase.csv` Status column | Execute manually; set Passed/Failed |
| `RTM.md` Automation Status | Update to Passed after full green run |
| `reports/execution-summary.template.md` | Record counts after `npm run report:copy` |

---

*Complement: `ai-prompts/requirements-and-planning.md` (planning phase), `ai-prompts/test-data.md` (data design), `ai-prompts/automation-and-debugging.md` (implementation fixes).*
