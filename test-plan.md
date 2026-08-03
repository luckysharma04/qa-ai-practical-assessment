# Test Plan — Practice Software Testing Toolshop

**Project:** QA AI Practical Assessment  
**Application:** Practice Software Testing — Toolshop v5.0 (Sprint 5)  
**Document:** Test Plan  
**Version:** 1.0  
**Related artifacts:** `project-info.md`, `qa-risk-analysis.md`, `FunctionalTestCase.csv`

| Item | Detail |
|------|--------|
| **UI SUT** | https://practicesoftwaretesting.com/ |
| **API SUT** | https://api.practicesoftwaretesting.com/api/documentation |
| **Automation** | Playwright + Prism Framework |
| **AI tooling** | Cursor AI |


---

## 1. Introduction

### 1.1 Purpose

This test plan defines the strategy, scope, environment, entry/exit criteria, execution approach, and deliverables for validating the **Toolshop ecommerce application** as part of the QA AI Capability Exercise. Testing covers **manual functional tests**, **UI automation**, and **API automation** aligned to assessment acceptance criteria (UI AC1/AC2, API AC1/AC2).

### 1.2 Objectives

1. Verify customer can **register, login, and view profile** (UI AC1 / API AC1).
2. Verify **end-to-end purchase flow**: browse → cart → COD checkout → invoice (double confirm) → My Invoices (UI AC2 / API AC2).
3. Validate **valid and invalid state transitions** across user → cart → invoice lifecycle.
4. Deliver **runnable automation** with `@Smoke` and `@Regression` tiers.
5. Demonstrate **traceable, AI-assisted QA workflow** with execution evidence.

### 1.3 References

| Document | Purpose |
|----------|---------|
| QA Practical Assessment PDF | Exercise requirements and submission criteria |
| `project-info.md` | Requirement analysis, ACs, scope |
| `qa-risk-analysis.md` | Risk register and mitigations |
| OpenAPI / Swagger | API contract reference |

---

## 2. Scope

### 2.1 In Scope

| Area | Test coverage |
|------|---------------|
| **Authentication** | Register, login, logout; profile view (UI AC1) |
| **Product catalog** | Listing, search, filter (category/brand/price/eco), sort, product detail |
| **Cart** | Add, update quantity, remove, view cart |
| **Checkout** | Billing form validation, Cash on Delivery selection |
| **Invoice** | Generate (UI: **two Confirm clicks**), My Invoices list/detail |
| **API — Auth** | Register, login, bearer token usage |
| **API — Catalog** | `GET /products` (list, search, filters) |
| **API — Cart** | Create cart, add/update items, verify contents |
| **API — Invoice** | `POST /invoices` (COD), `GET /invoices` |
| **Negative testing** | Invalid login, registration, empty cart, bad billing, invalid token, bad API payload |
| **Test types** | Manual (CSV), UI automation, API automation |
| **Tags** | `@Smoke`, `@Regression` |
| **Volume** | 5–8 test cases per tier (manual, UI, API) per assessment constraint |
| **Artifacts** | README, execution reports, `ai-prompts/`, iterative git history |

### 2.2 Out of Scope

| Area | Reason |
|------|--------|
| Bug-hunt SUT (`with-bugs.practicesoftwaretesting.com`) | Not core assessment target |
| API versions v1–v4 | Sprint 5 only |
| Full admin UI regression | Not in core ACs |
| All `/reports` endpoints | Stretch only |
| DELETE operations / admin destruction | Optional stretch |
| Penetration / full security audit | Beyond functional assessment |
| Load / stress / performance testing | Not in AC |
| Cross-browser matrix (Firefox, Safari, Edge) | Chromium default |
| Mobile / responsive certification | Not required |
| Non-COD payment gateways | COD only for core flows |
| Exhaustive catalog permutation testing | Bounded by case limit |

### 2.3 Acceptance Criteria Summary

| ID | Summary |
|----|---------|
| **UI-AC1** | Register → login → profile verification |
| **UI-AC2** | Browse → multi-cart → quantity update → COD checkout → double-confirm invoice → My Invoices |
| **API-AC1** | Register/login → bearer token → create cart |
| **API-AC2** | Get products → add to cart → verify cart → POST invoice (COD) |

### 2.4 Features by Priority

| Priority | Features |
|----------|----------|
| **P1** | Registration, login, catalog browse, add/update cart, checkout COD, invoice, My Invoices |
| **P2** | Profile, search/filter/sort, remove cart item, negatives |
| **P3** | Messages, reports, brands/categories stretch |

---

## 3. Environment

### 3.1 Test Environment

| Component | Configuration |
|-----------|---------------|
| **Environment name** | Public Sprint 5 (Production-like demo) |
| **UI base URL** | `https://practicesoftwaretesting.com/` |
| **API base URL** | `https://api.practicesoftwaretesting.com` |
| **API docs** | `https://api.practicesoftwaretesting.com/api/documentation` |
| **Database** | Shared public database (seeded products; shared user/order data) |
| **CDN / security** | Cloudflare on UI |

### 3.2 Test Tools & Runtime

| Tool | Version / notes |
|------|-----------------|
| Node.js | _[e.g. 18.x / 20.x — document in README]_ |
| npm | Package manager |
| Playwright | UI + API automation |
| Prism Framework | Page objects, project structure |
| Cursor AI | Requirement analysis, test design, automation assist |
| Git | Version control; public repo for submission |
| Browser | Chromium (Playwright-managed) |

### 3.3 Test Accounts

| Role | Email | Password | Usage |
|------|-------|----------|-------|
| Customer 1 | `customer@practicesoftwaretesting.com` | `welcome01` | Smoke, stable login |
| Customer 2 | `customer2@practicesoftwaretesting.com` | `welcome01` | Parallel / isolation |
| Admin | `admin@practicesoftwaretesting.com` | `welcome01` | Stretch / admin API only |
| Dynamic user | `testuser_<timestamp>@example.com` | Generated password | Registration regression |

### 3.4 Environment Constraints

- **No local SUT** — all tests target public URLs; internet required.
- **No private data** — do not use real PII; synthetic data only.
- **Shared state** — concurrent testers may affect carts/users; use unique emails and dynamic IDs.
- **No dedicated test data reset** — tests must tolerate or avoid collisions.

### 3.5 Environment Readiness Checklist

| Check | Method |
|-------|--------|
| UI reachable | Open home URL; products visible |
| API reachable | `GET /products` or status endpoint |
| Swagger available | `/api/documentation` loads |
| Default user login works | Manual or API login smoke |
| Playwright installs browsers | `npx playwright install` |
| npm dependencies installed | `npm install` |

---

## 4. Entry Criteria

Testing activities begin when **all** of the following are satisfied:

| # | Entry criterion | Owner |
|---|-----------------|-------|
| E1 | Requirement analysis complete (`project-info.md`) | QA |
| E2 | Risk analysis complete (`qa-risk-analysis.md`) | QA |
| E3 | Test plan approved / baselined (this document) | QA Lead |
| E4 | UI and API SUT accessible from test machine | QA |
| E5 | Swagger / OpenAPI documentation available | QA |
| E6 | Assessment ACs (UI AC1/AC2, API AC1/AC2) documented and mapped | QA |
| E7 | Node.js, npm, Playwright, and project dependencies installed | QA |
| E8 | Git repository initialized; `.gitignore` in place | QA |
| E9 | Test data strategy defined (unique users, dynamic IDs, billing template) | QA |
| E10 | Manual test case template / CSV structure ready | QA |

**Gate:** Entry criteria E1–E6 required before **test design**; E7–E10 required before **automation execution**.

---

## 5. Exit Criteria

Testing phase completes when **all** of the following are met:

| # | Exit criterion | Evidence |
|---|----------------|----------|
| X1 | Manual test suite complete (5–8 cases); key flows covered | `FunctionalTestCase.csv` |
| X2 | UI automation: smoke + regression suites implemented with `@Smoke` / `@Regression` | Spec files in Prism structure |
| X3 | API automation: smoke + regression suites implemented | API spec files |
| X4 | **All test cases execution status: Passed** | Execution reports |
| X5 | Smoke suite runnable from README in &lt; 30 minutes | README commands + timing |
| X6 | Regression suite runnable from README | README commands |
| X7 | Traceability: requirements → manual → automation documented | project-info + CSV IDs |
| X8 | Valid and invalid state transitions covered (manual + API) | Negative test cases |
| X9 | Execution evidence: HTML report, screenshots/logs as needed | `playwright-report/` or evidence folder |
| X10 | `readme.md` complete (setup, run commands, report location) | README |
| X11 | `ai-prompts/` folder complete with validation notes | ai-prompts/*.md |
| X12 | Iterative git history (not single commit) | Git log |
| X13 | Public git URL ready for submission | Remote repository |
| X14 | No open **P1 defects** blocking AC validation (or documented as SUT limitations) | Defect log |

**Gate:** Submission blocked if X4, X5, X6, or X10 fail.

---

## 6. Smoke Strategy

### 6.1 Purpose

Provide **fast confidence** (~15–30 minutes) that the SUT is available and the **critical commerce path** works before running full regression.

### 6.2 Scope

| Layer | # Cases (target) | Focus |
|-------|------------------|-------|
| Manual | 2–3 | Login, add to cart, invoice double-confirm |
| UI | 3–4 | Catalog load, login, minimal E2E checkout → invoice |
| API | 3–4 | Login token, create cart, GET products, invoice POST chain |

### 6.3 Smoke Scenarios

| ID | Scenario | Layer | AC |
|----|----------|-------|-----|
| SM-01 | Home/catalog loads with products | UI | UI-AC2 |
| SM-02 | Login with valid default customer | UI | UI-AC1 |
| SM-03 | Add one product to cart | UI | UI-AC2 |
| SM-04 | Login → COD checkout → double-confirm invoice → My Invoices | UI | UI-AC2 |
| SM-05 | API login returns valid `access_token` | API | API-AC1 |
| SM-06 | API create cart with bearer token | API | API-AC1 |
| SM-07 | API GET products returns catalog | API | API-AC2 |
| SM-08 | API chain: login → cart → add product → POST invoice (COD) | API | API-AC2 |

### 6.4 Smoke Rules

- Tag all smoke tests with `@Smoke`.
- Run smoke **before** every regression run and after environment changes.
- Smoke must **not** depend on hard-coded `cart_id` or `invoice_id`.
- Use default customer for UI smoke where possible; API chain for invoice smoke.
- Fail smoke → **stop** and fix before regression (environment or blocker defect).

### 6.5 Smoke Execution Command (planned)

```bash
npm run test:smoke
# or
npx playwright test --grep @Smoke
```

---

## 7. Regression Strategy

### 7.1 Purpose

Validate **extended functional depth** within assessment limits: full AC coverage, multi-item cart, filters, negatives, and error handling.

### 7.2 Scope

| Layer | # Cases (target) | Focus |
|-------|------------------|-------|
| Manual | 5–8 | AC1 + AC2, negatives, edge cases |
| UI | 5–8 | Register, profile, multi-cart, filters, billing errors, full E2E |
| API | 5–8 | Full AC chains, token/payload negatives, cart verification |

### 7.3 Regression Scenarios

| ID | Scenario | Layer | AC / Type |
|----|----------|-------|-----------|
| RG-01 | Register new user + profile verification | Manual / UI | UI-AC1 |
| RG-02 | Login/register negatives | Manual / UI / API | Negative |
| RG-03 | Search + filter + sort on catalog | UI | UI-AC2 |
| RG-04 | Multi-item cart + quantity update + remove item | UI / API | UI-AC2 / API-AC2 |
| RG-05 | Checkout billing validation errors | Manual / UI | Negative |
| RG-06 | Empty cart checkout blocked | Manual / UI | Negative |
| RG-07 | Full E2E: register → browse → multi-cart → COD → invoice | UI | UI-AC2 |
| RG-08 | API: invalid/missing bearer token | API | API-AC1 negative |
| RG-09 | API: invalid invoice payload / bad `cart_id` | API | API-AC2 negative |
| RG-10 | Invoice totals match cart; billing on invoice | UI / API | UI-AC2 / API-AC2 |

### 7.4 Regression Rules

- Tag with `@Regression`.
- Run only after **smoke passes**.
- Include at least one **negative** case per layer (auth, cart/checkout, invoice/API).
- Cap at 5–8 automated cases per UI and API tier.
- Document any flaky tests with mitigation (retry, worker=1, API setup).

### 7.5 Regression Execution Command (planned)

```bash
npm run test:regression
# or
npx playwright test --grep @Regression
```

---

## 8. UI Testing Strategy

### 8.1 Approach

- **User-centric E2E** validation of visible behavior, forms, navigation, and UX-specific rules (double-confirm invoice).
- **Page Object Model** via Prism Framework — separate pages: Login, Register, Catalog, Product, Cart, Checkout, Invoices, Profile.
- **Assertions** on UI state: visible text, cart counts, invoice list, error messages.
- **API cross-check** optional for cart totals when UI flakiness is a risk.

### 8.2 UI Test Design Principles

| Principle | Implementation |
|-----------|----------------|
| Resilient locators | Role, label, text; avoid brittle CSS chains |
| Explicit waits | `expect` auto-wait; avoid long fixed sleeps |
| Double-confirm invoice | `confirmInvoiceTwice()` in Checkout/Invoice page object |
| Auth state | Login helper; storage state reuse for regression speed |
| Screenshots | On failure; key steps for invoice flow evidence |
| Trace | Enable on first retry for debugging |

### 8.3 UI Coverage Matrix

| Feature | Smoke | Regression | Negative |
|---------|-------|------------|----------|
| Catalog load | ✓ | ✓ | — |
| Login | ✓ | ✓ | ✓ |
| Register | — | ✓ | ✓ |
| Profile | — | ✓ | — |
| Search/filter/sort | — | ✓ | — |
| Add to cart | ✓ | ✓ | — |
| Multi-cart / quantity | — | ✓ | — |
| Empty cart checkout | — | ✓ | ✓ |
| COD checkout | ✓ | ✓ | — |
| Billing validation | — | ✓ | ✓ |
| Invoice double-confirm | ✓ | ✓ | — |
| My Invoices | ✓ | ✓ | — |

### 8.4 UI Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Cloudflare blocks headless | Retries; headed mode; stable config |
| Fragile filter/sort locators | Page objects; scoped selectors |
| Double-confirm missed | Dedicated page object method; test step in manual CSV |
| Shared DB cart pollution | Login + fresh flow or API pre-setup |

### 8.5 Browser

- **Primary:** Chromium (Playwright bundled).
- Cross-browser manual spot-check optional; not required for submission.

---

## 9. API Testing Strategy

### 9.1 Approach

- **Contract and lifecycle** validation using Playwright `request` context or Prism API helpers.
- **State machine testing:** register → login → cart → add items → verify → invoice.
- **Dynamic ID chaining** — never hard-code `cart_id`, `invoice_id`, or `product_id`.
- **Negative testing** on auth header and invoice payload.

### 9.2 API Test Layers

| Layer | Endpoints (representative) | Purpose |
|-------|---------------------------|---------|
| Auth | `POST /users/register`, `POST /users/login` | User creation, token |
| Catalog | `GET /products`, query params | Product discovery |
| Cart | `POST /carts`, add/update items, `GET /carts/{id}` | Cart lifecycle |
| Invoice | `POST /invoices`, `GET /invoices` | Order completion |
| Negative | Same with bad token/payload | Error handling |

### 9.3 API Coverage Matrix

| Scenario | Smoke | Regression |
|----------|-------|------------|
| Register user | — | ✓ |
| Login + token | ✓ | ✓ |
| Invalid token | — | ✓ |
| GET products | ✓ | ✓ |
| Create cart | ✓ | ✓ |
| Add/update cart items | ✓ | ✓ |
| Verify cart GET | ✓ | ✓ |
| POST invoice (COD) | ✓ | ✓ |
| Invalid invoice payload | — | ✓ |
| GET invoices | — | ✓ (if in scope) |

### 9.4 API Assertions

| Assertion type | Examples |
|----------------|----------|
| Status code | 200/201 success; 401/403/400/422 errors |
| Response body | `access_token` present; `cart_id` returned; line items match |
| Headers | `Authorization: Bearer <token>` on protected calls |
| Business rules | `payment_method` = `cash-on-delivery`; billing fields present |

### 9.5 Reference Invoice Payload

```json
{
  "billing_street": "Zoey Shore",
  "billing_city": "Hesselbury",
  "billing_state": "Florida",
  "billing_country": "TG",
  "billing_postal_code": "1234AA",
  "payment_method": "cash-on-delivery",
  "cart_id": "<dynamic from POST /carts>",
  "payment_details": {}
}
```

### 9.6 API vs UI Division

| Validate on API | Validate on UI |
|-----------------|----------------|
| Token issuance, status codes | Double-confirm button behavior |
| Cart JSON structure | Form layout, error message UX |
| Invoice POST contract | My Invoices navigation |
| Fast setup/teardown | Visual catalog filters |

---

## 10. Data Strategy

### 10.1 Principles

| Principle | Detail |
|-----------|--------|
| **Synthetic only** | No real PII; fake names, addresses, emails |
| **Unique registration** | `testuser_<timestamp>@example.com` to avoid duplicate-email failures |
| **Stable smoke user** | Default customer credentials for repeatable smoke |
| **Dynamic IDs** | Extract `product_id`, `cart_id`, `invoice_id` at runtime |
| **No hard-coded carts** | Invoice tests always chain from live cart creation |
| **Reusable billing block** | Standard billing JSON for API; same data in UI forms |

### 10.2 Test Data Catalog

| Data element | Source | Example |
|--------------|--------|---------|
| Smoke login | Static (public SUT) | `customer@practicesoftwaretesting.com` / `welcome01` |
| Registration email | Generated | `testuser_20260803120000@example.com` |
| Registration password | Generated / fixed test pwd | `TestPass123!` (meet validation rules) |
| Product ID | `GET /products` response | First available product ID |
| Cart ID | `POST /carts` response | Runtime |
| Billing street | Fixture / faker | `Zoey Shore` |
| Billing city | Fixture | `Hesselbury` |
| Billing state | Fixture | `Florida` |
| Billing country | Fixture | `TG` |
| Billing postal | Fixture | `1234AA` |
| Payment method | Fixed for scope | `cash-on-delivery` |
| Bearer token | `POST /users/login` | Runtime; mask in logs |

### 10.3 Data Setup Patterns

| Pattern | Use when |
|---------|----------|
| **UI-only setup** | Testing registration UX, full UI E2E |
| **API setup → UI verify** | UI checkout when login is slow; pre-fill cart via API |
| **API-only chain** | API smoke/regression; fastest lifecycle |
| **Static user** | Smoke login, catalog browse |

### 10.4 Data Cleanup

- **No formal cleanup API** on shared public DB.
- Mitigate via unique users and new carts per run.
- Do not DELETE production-shared entities unless stretch admin scope.

### 10.5 AI-Assisted Data Generation

- Use Cursor for faker patterns and payload templates.
- Record prompts in `ai-prompts/test-data.md` with validation notes.
- Human review: confirm emails are synthetic and passwords meet SUT rules.

---

## 11. Automation Strategy

### 11.1 Framework & Structure

```
qa-ai-practical-assessment/
├── FunctionalTestCase.csv
├── PrismStructure/          # Playwright + Prism
│   ├── pages/                 # Page objects
│   ├── tests/
│   │   ├── ui/                # @Smoke / @Regression UI specs
│   │   └── api/               # @Smoke / @Regression API specs
│   ├── utils/                 # auth, cart, invoice helpers
│   ├── playwright.config.js
│   └── package.json
├── project-info.md
├── qa-risk-analysis.md
├── test-plan.md
├── readme.md
└── ai-prompts/
```

### 11.2 Automation Principles

| Principle | Detail |
|-----------|--------|
| Prism + Playwright | Follow existing Prism patterns for pages and specs |
| Tags | `@Smoke`, `@Regression` on describe or test level |
| Helpers | `login()`, `getToken()`, `createCart()`, `addToCart()`, `createInvoice()` |
| No magic IDs | Chain API responses |
| Independent tests | Prefer test-level setup; avoid order dependency |
| README-driven | Single commands for smoke and regression |
| AI assist | Sonnet for code; Auto for docs; always review and run |

### 11.3 Automation Phasing

| Phase | Deliverable | Git commit |
|-------|-------------|------------|
| 1 | Project scaffold, config, helpers | `chore: playwright prism scaffold` |
| 2 | API smoke tests | `test: api smoke suite` |
| 3 | API regression tests | `test: api regression suite` |
| 4 | UI page objects | `feat: ui page objects` |
| 5 | UI smoke tests | `test: ui smoke suite` |
| 6 | UI regression tests | `test: ui regression suite` |
| 7 | Reports + README commands | `docs: readme and execution evidence` |

### 11.4 CI / Local Execution (planned)

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npx playwright install` | Install browsers |
| `npm run test:smoke` | Smoke suite |
| `npm run test:regression` | Regression suite |
| `npm test` | Full suite (if defined) |

### 11.5 Reporting

| Report | Location |
|--------|----------|
| HTML report | `playwright-report/` |
| JSON results | `test-results/` (if configured) |
| Screenshots | `test-results/` on failure |
| Execution evidence | Screenshots/logs in repo or evidence folder per README |

### 11.6 Stability Configuration

| Setting | Recommendation |
|---------|----------------|
| Workers | `1` if shared DB collisions occur |
| Retries | `1` on CI/local for UI navigation only |
| Timeout | 30–60s per test; tune for checkout flow |
| Trace | `on-first-retry` |

---

## 12. Defect Management

### 12.1 Defect Lifecycle

```
New → Assigned → In Progress → Fixed / Won't Fix → Verified → Closed
```

For this assessment, defects are tracked in a **lightweight log** (markdown table or GitHub Issues on public repo).

### 12.2 Severity Definitions

| Severity | Definition | Example |
|----------|------------|---------|
| **S1 — Critical** | Core AC blocked; no workaround | Cannot generate invoice; login broken |
| **S2 — Major** | AC partially blocked; workaround exists | Invoice works API-only; UI double-confirm fails |
| **S3 — Minor** | Non-AC feature wrong; cosmetic | Sort label typo |
| **S4 — Trivial** | Cosmetic / documentation | Spelling in footer |

### 12.3 Priority vs Assessment

| Priority | Action |
|----------|--------|
| P1 (S1/S2 on AC path) | Fix test or file SUT defect; block submission if AC unmet |
| P2 (S2/S3 off critical path) | Document; fix if time permits |
| P3 (S3/S4) | Log as known limitation or stretch |

### 12.4 Defect Log Template

| ID | Title | Layer | Severity | Steps | Expected | Actual | Status | AC |
|----|-------|-------|----------|-------|----------|--------|--------|-----|
| DEF-001 | _example_ | UI | S2 | ... | Invoice after 2 confirms | Fails after 1 | Open | UI-AC2 |

### 12.5 SUT vs Test Defect

| Type | Action |
|------|--------|
| **Test defect** | Fix automation, data, or assertion; re-run suite |
| **SUT defect** | Log with evidence; if intentional SUT behavior (double-confirm), document as expected |
| **Environment defect** | SUT down, Cloudflare — pause execution; retry later |

### 12.6 Known Behaviors (not defects)

- Invoice UI requires **two Confirm clicks** — expected per assessment.
- Shared public database — data collisions from other testers.
- Some API writes without authentication — documented in risk analysis.

---

## 13. Deliverables

| # | Deliverable | Format | Due phase |
|---|-------------|--------|-----------|
| D1 | Requirement analysis | `project-info.md` | Phase 1 |
| D2 | Risk analysis | `qa-risk-analysis.md` | Phase 1 |
| D3 | Test plan | `test-plan.md` | Phase 1 |
| Manual test suite | `FunctionalTestCase/FunctionalTestCase.csv` | Phase 2 |
| D5 | AI prompt history — requirements | `ai-prompts/requirements-and-planning.md` | Phase 1–2 |
| D6 | AI prompt history — test design | `ai-prompts/test-design.md` | Phase 2 |
| D7 | AI prompt history — test data | `ai-prompts/test-data.md` | Phase 2 |
| D8 | UI automation (smoke + regression) | PrismStructure / Playwright specs | Phase 4–5 |
| D9 | API automation (smoke + regression) | API specs + helpers | Phase 3 |
| D10 | Test data strategy | project-info + test-data prompts | Phase 2 |
| D11 | Execution reports (all Passed) | HTML report + evidence | Phase 6 |
| D12 | README | `readme.md` | Phase 6 |
| D13 | AI prompt history — automation/debug | `ai-prompts/automation-and-debugging.md` | Phase 3–5 |
| D14 | AI prompt history — documentation | `ai-prompts/documentation-and-summary.md` | Phase 6 |
| D15 | Public git repository URL | Git remote | Submission |
| D16 | Iterative commit history | Git log | Ongoing |

### 13.1 Repository Structure (required)

```
qa-ai-practical-assessment/
├── FunctionalTestCase.csv
├── PrismStructure/
├── project-info.md
├── qa-risk-analysis.md
├── test-plan.md
├── readme.md
└── ai-prompts/
    ├── requirements-and-planning.md
    ├── test-design.md
    ├── test-data.md
    ├── automation-and-debugging.md
    └── documentation-and-summary.md
```

---

## 14. Execution Plan

### 14.1 Timeline Overview (~5–10 hours)

| Phase | Activities | Est. hours | Output |
|-------|------------|------------|--------|
| **Phase 1** | Requirements, risk, test plan | 1–2 | project-info, qa-risk-analysis, test-plan |
| **Phase 2** | Manual test design (CSV), ai-prompts planning | 1–2 | FunctionalTestCase.csv, test-design prompts |
| **Phase 3** | API automation — helpers, smoke, regression | 1.5–2 | API specs, automation prompts |
| **Phase 4** | UI page objects + smoke | 1.5–2 | Page objects, UI smoke |
| **Phase 5** | UI regression, manual execution | 1–2 | UI regression, manual results |
| **Phase 6** | Full run, reports, README, git push | 1–2 | Reports, readme, public URL |

### 14.2 Detailed Execution Schedule

| Day / Step | Task | Owner | Dependencies |
|------------|------|-------|--------------|
| 1 | Finalize requirement + risk + test plan | QA | Assessment PDF |
| 1 | Environment smoke (manual UI + API) | QA | SUT access |
| 2 | Create manual test cases (smoke + regression) | QA | Test plan |
| 2 | Document ai-prompts/requirements-and-planning.md | QA | Phase 1 |
| 3 | Scaffold Playwright/Prism; API helpers | QA | Node/npm |
| 3 | Implement + run API smoke | QA | Helpers |
| 4 | Implement + run API regression | QA | API smoke pass |
| 4 | ai-prompts/test-data.md + test-design.md | QA | CSV draft |
| 5 | UI page objects (login, cart, checkout, invoice) | QA | API patterns |
| 5 | UI smoke + fix double-confirm flow | QA | Page objects |
| 6 | UI regression suite | QA | UI smoke pass |
| 6 | Execute manual suite; update CSV status | QA | CSV |
| 7 | Full smoke + regression run | QA | All suites |
| 7 | Fix failures; capture reports/screenshots | QA | Execution |
| 7 | README, documentation prompts, git push | QA | All Passed |

### 14.3 Execution Order (test runs)

```
1. Environment readiness check (manual)
2. API @Smoke
3. API @Regression
4. UI @Smoke
5. UI @Regression
6. Manual suite (parallel with automation tuning)
7. Final full regression + evidence capture
```

### 14.4 Go / No-Go per Phase

| Gate | Condition |
|------|-----------|
| Start automation | Entry criteria E7–E10 met |
| Start UI automation | API helpers proven (token, cart, invoice) |
| Start regression | Smoke 100% pass |
| Submission | Exit criteria X1–X14 met |

### 14.5 Resource Plan

| Role | Responsibility |
|------|----------------|
| QA Engineer | Test design, automation, execution, artifacts |
| QA Lead | Plan approval, scope control, risk review |
| Cursor AI | Assist analysis, design, code, debugging (reviewed by QA) |

### 14.6 Communication

| Event | Action |
|-------|--------|
| Smoke failure | Diagnose env vs test vs SUT; fix before proceeding |
| Blocker defect on AC | Log S1; attempt workaround; document in defect log |
| Scope change | Update test plan + project-info; do not exceed 5–8 cases/tier |

---

## 15. Traceability

| Requirement | Manual ID | UI spec | API spec | Smoke | Regression |
|-------------|-----------|---------|----------|-------|------------|
| UI-AC1 Register/login/profile | TC-M-xx | ui/*.spec | — | Partial | ✓ |
| UI-AC2 E2E purchase | TC-M-xx | ui/*.spec | — | ✓ | ✓ |
| API-AC1 Auth + cart | TC-M-xx | — | api/*.spec | ✓ | ✓ |
| API-AC2 Products + invoice | TC-M-xx | — | api/*.spec | ✓ | ✓ |
| Negatives | TC-M-xx | ui + api | api/*.spec | — | ✓ |

_*Populate IDs when CSV and specs are created._

---

## 16. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | _[Fill in]_ | _[Fill in]_ | |
| QA Engineer | _[Fill in]_ | _[Fill in]_ | |

---

*End of Test Plan*
