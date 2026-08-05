# Project Info — QA AI Practical Assessment

| Field | Value |
|-------|-------|
| **Primary AI tool** | Cursor AI (Composer / Agent mode) |
| **Application under test** | Practice Software Testing Toolshop — Checkout & Application Flow (Sprint 5) |
| **Assessment start date** | 29 July 2026 |
| **Submission date** | 07 August 2026 |

**SUT URLs**

| Layer | URL |
|-------|-----|
| UI | https://practicesoftwaretesting.com/ |
| API | https://api.practicesoftwaretesting.com |
| API documentation | https://api.practicesoftwaretesting.com/api/documentation |

---

## Project Summary

This submission validates the **Practice Software Testing Toolshop** — a B2C ecommerce application for tools and hardware — across **manual**, **UI**, and **API** test tiers. The primary business focus is the **customer purchase lifecycle**: registration and login, product discovery, cart management, **Cash on Delivery (COD)** checkout, invoice generation (including the application's **double-confirm** UX on the UI), and verification under **My Invoices**.

Deliverables include:

- **8 manual functional test cases** (3 Smoke + 5 Regression) in `FunctionalTestCase.csv`
- **8 UI automation specs** (3 Smoke + 5 Regression) in `PrismStructure/Tests/ui/`
- **8 API automation specs** (3 Smoke + 5 Regression) in `PrismStructure/API/tests/`
- Supporting artifacts: test plan, risk analysis, RTM, AI prompt history, execution reports, and README

Automation uses **Playwright** with a **Prism-style JavaScript framework** (page objects, API service layer, fixtures, reusable flows). Tests are tagged `@Smoke`, `@Regression`, `@UI`, and `@API` for filtered execution via Playwright projects and npm scripts.

---

## Tools Used

| Category | Tool / approach |
|----------|-----------------|
| AI assistant | Cursor AI |
| UI automation | Playwright + Page Object Model |
| API automation | Playwright `APIRequestContext` |
| Language | JavaScript (Node.js) |
| Runtime | Node.js 18+, npm |
| Browser | Chromium (default) |
| Test data | JSON fixtures, `@faker-js/faker`, timestamp-based emails |
| Assertions | Centralized UI/API helpers + JSON schema validators |
| Reporting | HTML, JSON, JUnit, custom failure logs, screenshots, video, trace |
| Version control | Git (iterative commits per phase) |
| Documentation | Markdown (project-info, test-plan, RTM, README) |

---

## AI Usage

Cursor AI was used throughout the assessment as a **collaborative QA partner** — not as an unchecked code generator. The workflow followed structured phases: understand requirements, design tests, implement automation, validate against the live SUT, debug failures, and document outcomes in `ai-prompts/`.

### How project and SUT context is provided

- Shared the assessment brief, SUT URLs, and acceptance criteria (UI-AC1/AC2, API-AC1/AC2) as the initial anchor.
- Referenced live Swagger documentation and UI network traffic when validating API contracts.
- Pointed Cursor to existing framework files (`Pages/`, `Fixtures/`, `Config/`) before requesting new specs to preserve conventions.
- Used **focused, single-task sessions** (e.g., invoice double-confirm only, API cart endpoint probing only) to reduce context drift.
- Summarized completed work into `ai-prompts/` so later sessions did not repeat full context.

### AI role by activity

| Activity | AI contribution | Human oversight |
|----------|-----------------|-----------------|
| Requirement analysis | Flow extraction, risk ideas, scope boundaries | Verified against live SUT and Swagger |
| Test planning | Smoke/regression split, case counts, RTM mapping | Enforced 5–8 case limit per tier |
| Manual test design | CSV steps, preconditions, expected results | Reviewed for AC traceability |
| UI automation | Page objects, fixtures, spec scaffolding | Reviewed locators, waits, assessment UX rules |
| API automation | Service layer, E2E chain, payload templates | Probed endpoints; corrected wrong paths |
| Test data | Faker patterns, negative payloads | No real PII; public SUT credentials only |
| Debugging | Trace interpretation, locator fixes | Re-ran suites; confirmed root cause |
| Documentation | README, project-info drafts | Edited for accuracy and submission tone |

Prompt history is maintained in `ai-prompts/` (requirements, test design, test data, automation/debugging, documentation).

---

## Requirement Analysis

### Business context

Toolshop is a **B2C ecommerce platform** for tools and hardware. Customers browse a catalog (with sustainability filters), build a cart, complete checkout with **Cash on Delivery**, and receive an invoice. The REST API mirrors the same commerce lifecycle for headless validation.

### Core happy path

```
Discover Products → Authenticate → Add to Cart → Manage Cart → Checkout (COD) → Generate Invoice (×2 Confirm on UI) → View My Invoices
```

| Step | Business activity | UI | API |
|------|-------------------|-----|-----|
| 1 | Discover products | Home / listing | `GET /products` |
| 2 | Register or login | Register / Login | `POST /users/register`, `POST /users/login` |
| 3 | View product details | Product page | `GET /products/{id}` |
| 4 | Add items to cart | Add to cart | `POST /carts`, `POST /carts/{id}` |
| 5 | Update cart quantity | Checkout / cart | `POST /carts/{id}` (increment) |
| 6 | Checkout with billing | Checkout wizard | Billing fields in invoice payload |
| 7 | Select Cash on Delivery | Payment step | `payment_method: cash-on-delivery` |
| 8 | Confirm invoice (**twice on UI**) | Finish × 2 | `POST /invoices` |
| 9 | View order history | My Invoices | `GET /invoices` |

### API state machine

```
[User Created] → [Authenticated] → [Cart Created] → [Items Added] → [Cart Verified] → [Invoice Generated] → [Invoice Listed]
```

### Exception flows

| Flow | Expected behavior |
|------|-------------------|
| Guest browse | Catalog without login; purchase requires auth |
| Invalid login | Error shown; no session / token |
| Invalid registration | Duplicate email, weak password rejected |
| Empty cart checkout | Checkout blocked or no proceed action |
| Invalid billing | Validation error; proceed disabled |
| Invalid bearer token | `401` / `403` on protected endpoints |
| Invalid invoice payload | `400` / `422` / `404` with error body |

### Actors

| Actor | Role | Auth |
|-------|------|------|
| Guest | Browse catalog | None |
| Registered customer | Register, cart, checkout, invoices | Bearer token / session |
| Returning customer | Login, repeat purchase | Bearer token / session |
| Admin | Admin operations (stretch) | Admin token |
| QA engineer | Execute manual and automated tests | Test accounts |

**Default public test users**

| User | Email | Password |
|------|-------|----------|
| Customer 1 | `customer@practicesoftwaretesting.com` | `welcome01` |
| Customer 2 | `customer2@practicesoftwaretesting.com` | `welcome01` |
| Admin | `admin@practicesoftwaretesting.com` | `welcome01` |

### Features (priority)

| ID | Feature | UI | API | Priority |
|----|---------|-----|-----|----------|
| F-01 | User registration | ✓ | ✓ | P1 |
| F-02 | Login / logout | ✓ | ✓ | P1 |
| F-03 | Profile view | ✓ | — | P2 |
| F-04 | Product catalog | ✓ | ✓ | P1 |
| F-05 | Search / filter | ✓ | ✓ | P2 |
| F-06 | Add to cart | ✓ | ✓ | P1 |
| F-07 | Update cart quantity | ✓ | ✓ | P1 |
| F-08 | Checkout billing | ✓ | ✓ | P1 |
| F-09 | COD payment | ✓ | ✓ | P1 |
| F-10 | Invoice generation | ✓ | ✓ | P1 |
| F-11 | My Invoices | ✓ | ✓ | P1 |

### Dependencies

| Dependency | Impact if unavailable |
|------------|------------------------|
| UI host (`practicesoftwaretesting.com`) | All UI tests blocked |
| API host (`api.practicesoftwaretesting.com`) | All API tests blocked |
| Swagger / OpenAPI | Contract design blocked |
| Shared public database | Data collisions, flaky registration |
| Playwright + Node.js | Automation cannot run |

### Risks (summary)

| ID | Risk | Mitigation |
|----|------|------------|
| R-01 | Shared DB collisions | Unique emails; dynamic registration |
| R-02 | Cloudflare / UI flake | Retries; stable waits; single worker |
| R-03 | Double-confirm invoice missed | Explicit `confirmInvoiceTwice()` in page object |
| R-04 | Wrong API cart endpoint | Probed live API; `POST /carts/{id}` not `/items` |
| R-05 | AI-generated wrong assertions | Schema validators + human review |
| R-06 | Time box pressure | Smoke first; phased delivery |

Full register: `qa-risk-analysis.md`.

### In scope

- UI AC1: registration, login, profile, auth negatives
- UI AC2: catalog, cart, COD checkout, double-confirm invoice, My Invoices
- API AC1: register, login, token, cart create, token negatives
- API AC2: products, cart mutations, invoice POST/GET, payload negatives
- Manual CSV (8 cases), UI/API automation (5–8 per tier), reports, README, ai-prompts

### Out of scope

- Bug-hunt environment, API v1–v4, full admin UI regression
- Security / penetration testing, load testing, cross-browser matrix
- Non-COD payment gateways, exhaustive catalog permutations
- Stretch API areas (messages, reports) unless time permits

### Acceptance criteria

#### UI-AC1: Registration & login

| # | Criterion |
|---|-----------|
| 1 | New user registers with valid details |
| 2 | User logs in with registered credentials |
| 3 | Profile displays correct user information |
| 4 | Invalid login rejected with error |
| 5 | Invalid registration rejected (duplicate email, weak password) |

#### UI-AC2: End-to-end purchase

| # | Criterion |
|---|-----------|
| 1 | User browses products |
| 2 | User adds multiple items to cart |
| 3 | User updates item quantity |
| 4 | Checkout completes with Cash on Delivery |
| 5 | Invoice requires **two Confirm clicks** |
| 6 | Invoice visible under My Invoices |
| 7 | Invoice details match order and billing |

#### API-AC1: Authentication & cart

| # | Criterion |
|---|-----------|
| 1 | Register via `POST /users/register` |
| 2 | Login returns valid `access_token` |
| 3 | Bearer token works on protected endpoints |
| 4 | Cart created with `POST /carts` |
| 5 | Missing / invalid token rejected |

#### API-AC2: Products & invoice

| # | Criterion |
|---|-----------|
| 1 | Products retrieved via `GET /products` |
| 2 | Products added to cart |
| 3 | Cart contents verified via `GET /carts/{id}` |
| 4 | Invoice generated via `POST /invoices` (COD) |
| 5 | Payload includes billing, `cart_id`, `payment_method` |
| 6 | Invalid payload rejected |

**Reference invoice POST body**

```json
{
  "billing_street": "Zoey Shore",
  "billing_city": "Hesselbury",
  "billing_state": "Florida",
  "billing_country": "TG",
  "billing_postal_code": "1234AA",
  "payment_method": "cash-on-delivery",
  "cart_id": "<dynamic>",
  "payment_details": {}
}
```

---

## Test Planning

### Tier strategy

| Tier | Tag | Intent | Target duration |
|------|-----|--------|-----------------|
| **Smoke** | `@Smoke` | Fast health checks on critical paths | ~15–30 minutes full smoke |
| **Regression** | `@Regression` | Broader AC coverage + negatives | Run after smoke is green |

### Case allocation (assessment limit: 5–8 per type)

| Type | Smoke | Regression | Total | Status |
|------|-------|------------|-------|--------|
| Manual | 3 | 5 | 8 | `FunctionalTestCase.csv` |
| UI automation | 3 | 5 | 8 | `PrismStructure/Tests/ui/` |
| API automation | 3 | 5 | 8 | `PrismStructure/API/tests/` |

Manual cases **TC-M-001–008** map to UI specs **TC-UI-SM-*** / **TC-UI-RG-*** and API specs **TC-API-SM-*** / **TC-API-RG-*** via `RTM.md`.

### UI vs API planning

| Concern | UI automation | API automation |
|---------|---------------|----------------|
| Primary value | UX flows, double-confirm, form validation, My Invoices UI | Contract speed, token/cart/invoice chain |
| Setup | Browser + page objects | `APIRequestContext` + service layer |
| Negatives | Visible errors, disabled buttons | Status codes + error body schema |
| Data setup | Login via UI or reuse default customer | Register/login + bearer token in headers |

### Execution order

1. Requirement analysis and risk register
2. Manual smoke → manual regression
3. API smoke → API regression (fast feedback on contracts)
4. UI smoke → UI regression
5. Full suite + reports + README
6. Copy execution evidence to `reports/`

### Traceability

Requirements → manual IDs → automation IDs documented in:

- `RTM.md` / `RTM.csv`
- `test-plan.md`
- Spec file names and test titles (e.g. `TC-UI-SM-LOGIN`, `TC-API-SM-003`)

---

## Automation Strategy

### Framework choice

**Playwright (JavaScript)** was selected for:

- Unified UI and API testing in one runner
- Built-in `APIRequestContext` (no separate HTTP client required)
- Strong reporting (HTML, trace, screenshot, video)
- Fixture model for page objects and API services

The **Prism Framework** pattern organizes code into Pages, Tests, API services, Fixtures, Utils, Config, and Reports under `PrismStructure/`.

### Layer architecture

```
UI:  Spec → Fixture (pages, uiFlows) → Page Object → SUT browser
API: Spec → Fixture (apiServices, apiFlows) → Service → ApiClient → SUT API
```

### UI automation

| Element | Location | Responsibility |
|---------|----------|----------------|
| Page objects | `Pages/` | Locators (`data-test`), navigation, actions — no assertions |
| UI flows | `Utils/uiFlows.js` | Login, add to cart, COD checkout, sign out |
| Fixtures | `Fixtures/testFixtures.js` | Injects `pages`, `uiFlows`, page shortcuts |
| Specs | `Tests/ui/smoke`, `Tests/ui/regression` | Thin tests; RTM IDs in titles |
| Assertions | `Utils/assertions.js` | Auth, cart, invoice, catalog helpers |

**Key UI behaviors encoded in framework**

- Do not open `/cart` before checkout (can clear session cart).
- Checkout wizard: billing includes `house_number`; finish button clicked twice for invoice.
- Logout via user menu dropdown.

### API automation

| Element | Location | Responsibility |
|---------|----------|----------------|
| Client | `API/clients/ApiClient.js` | `APIRequestContext`, bearer headers |
| Services | `API/services/` | Auth, Cart, Product, Invoice endpoints |
| Flows | `Utils/apiFlows.js` | Register → login → cart → invoice lifecycle |
| Schemas | `API/schemas/apiSchemas.js` | Response body structure validation |
| Assertions | `Utils/apiAssertions.js` | Status + schema wrappers |
| Specs | `API/tests/smoke`, `API/tests/regression` | RTM-mapped API tests |

**Verified API conventions**

- Add line item: `POST /carts/{cartId}` with `{ product_id, quantity }`
- Cart delete cleanup: `DELETE /carts/{cartId}` → `204`
- User self-delete: not supported (`403`) — cart cleanup only

### Tags and projects

| Tag | Purpose |
|-----|---------|
| `@Smoke` | Fast critical path |
| `@Regression` | Extended + negative coverage |
| `@UI` | UI layer filter |
| `@API` | API layer filter |

Playwright projects: `ui-smoke`, `ui-regression`, `api-smoke`, `api-regression` (grep on combined tags).

### Reporting and artifacts

Configured in `playwright.config.js`:

- HTML, JSON, JUnit, custom failure logs
- Screenshot, video, trace: **retain on failure**
- Submission copy: `npm run report:copy` → `reports/`

---

## Test Data

### Sources

| Location | Contents |
|----------|----------|
| `test-data/users-valid.json` | Valid registration templates |
| `test-data/users-invalid.json` | Invalid login / registration cases |
| `test-data/addresses.json` | Assessment billing reference (API + UI) |
| `test-data/products.json` | Search terms |
| `test-data/negative-data.json` | API negative headers and invoice payloads |
| `test-data/boundary-values.json` | Cart quantity boundaries |
| `PrismStructure/Data/` | Runtime modules (e.g. `defaultCustomer`) |
| `PrismStructure/Utils/dataGenerator.js` | Faker + `uniqueEmail()`, `apiRegistrationPayload()` |

### Dynamic data strategy

| Need | Approach |
|------|----------|
| Registration | `testuser_<timestamp>@example.com` + strong unique password |
| API invoice | `cart_id` from prior `POST /carts` response |
| Product ID | `getFirstInStockProductId()` from live `GET /products` |
| Phone | Numeric only (SUT validation) |

### Default stable accounts (public SUT)

Used for smoke login and cart regression where unique registration is not required:

- `customer@practicesoftwaretesting.com` / `welcome01`

### Assessment billing reference

Used for COD checkout and `POST /invoices`:

| Field | Value |
|-------|-------|
| Street | Zoey Shore |
| City | Hesselbury |
| State | Florida |
| Country | TG |
| Postal code | 1234AA |

### Environment assumptions

- Sprint 5 public URLs only (no local stack)
- Shared database — tests may see data from other users
- No dedicated test tenant or API seed endpoint
- Cloudflare may affect UI timing

Prompt notes: `ai-prompts/test-data.md`.

---

## Validation

### Manual tests

- Execute steps from `FunctionalTestCase.csv` against live SUT
- Record **Passed** / **Failed** in Status column
- Capture screenshots for key flows in `screenshots/`

### Automation — process

1. **Smoke first** — fix failures before expanding regression
2. **Live SUT execution** — no mocked API responses
3. **AC traceability** — each spec title maps to RTM ID and manual case where applicable
4. **Assertion review** — replaced weak checks (`toBeTruthy`, `ok()`) with:
   - HTTP status expectations
   - Response body schema validation (`apiSchemas.js`)
   - Domain helpers: token, cart, invoice, UI catalog/checkout/invoice
5. **Full suite runs** — `npm run test:smoke`, `npm run test:regression` with reports generated

### API validation specifics

| Check | Method |
|-------|--------|
| Login body | JWT format, `token_type`, `expires_in` |
| Cart body | `cart_items`, `product_id`, quantity, nested product price |
| Invoice body | `INV-*` number, billing fields, `subtotal` / `total` |
| Errors | `message`, `errors`, or Laravel field validation arrays |
| Unauthorized | `401`/`403` + error message |

### UI validation specifics

| Check | Method |
|-------|--------|
| Auth state | Nav sign-in visibility, account URL |
| Catalog | Product count, search term in results |
| Cart / checkout | Line items, quantities, cart total, confirm step |
| Invoice | Table rows, `INV-*` pattern, billing text in table |
| Negatives | Alert visible, proceed disabled, invoice count stable |

### Refinement driven by validation

| Finding | Fix applied |
|---------|-------------|
| Wrong cart add endpoint | `POST /carts/{id}` instead of `/items` |
| Invoice needs two confirms | `confirmInvoiceTwice()` with DOM click |
| Cart empty on checkout | Verify on `/checkout`, not `/cart` |
| Registration password rejected | Unique strong passwords via generator |
| Profile pre-fills billing | Assert populated fields, not exact assessment values on checkout |

Validation notes: `ai-prompts/test-design.md`.

---

## Debugging

### Process

1. Re-run failed spec individually with Playwright CLI
2. Open **HTML report** (`npm run report`) — screenshots, video, trace links
3. Review **failure logs** (`Reports/failure-logs/failures.log`)
4. Share trace snippet, response body, or locator error with Cursor in a **focused debug session**
5. Apply minimal fix; re-run smoke affected area before full regression

### Artifacts used

| Artifact | Location | Use |
|----------|----------|-----|
| HTML report | `Reports/playwright-report/` | Primary triage UI |
| Trace | `Reports/test-results/` | Step timeline, network, DOM |
| Screenshot | `Reports/test-results/` | Failure state capture |
| Video | `Reports/test-results/` | UI flow replay |
| Failure log | `Reports/failure-logs/` | Consolidated errors + attachment paths |
| API logs | `Utils/logger.js` | Request method, path, status in console |

### Common issues resolved

| Symptom | Root cause | Resolution |
|---------|------------|------------|
| Empty checkout | Opened `/cart` or timing | `openWithItems()` on checkout |
| Finish button not clickable | Hidden in wizard step | `evaluate()` DOM click |
| `proceed-3` disabled | Missing `house_number` | Fill house number in billing |
| Registration fail | Common password / phone format | Faker + numeric phone |
| API cart 404 | Wrong endpoint | `POST /carts/{cartId}` |
| Flaky login page | Slow load | Wait for email field in `LoginPage.open()` |
| Search assertion fail | First result not matching term | Assert any result contains term |

Outcomes logged: `ai-prompts/automation-and-debugging.md`.

---

## Sensitive Information

### Information **not** shared with AI tools

| Category | Examples |
|----------|----------|
| Personal credentials | Real email, phone, passwords beyond public SUT defaults |
| Corporate secrets | Internal URLs, VPN, proprietary API keys |
| Production systems | Any environment unrelated to Toolshop Sprint 5 |
| Tokens in prompts | Paste full bearer tokens from other systems |
| Raw verbose logs | Full logs with PII — summarize errors instead |

### Information **appropriate** to share

- Public SUT URLs and Swagger documentation
- Public demo credentials (`customer@…`, `welcome01`)
- Synthetic test data (`testuser_timestamp@example.com`)
- Playwright traces, screenshots, and **sanitized** API response bodies
- Framework file paths and assessment acceptance criteria

### Repository hygiene

- No `.env` files with secrets committed
- No hard-coded personal data in specs or JSON fixtures
- Invoice/cart IDs are runtime-generated, not production identifiers

If a secret is accidentally committed: remove immediately, rotate if applicable, and use secure storage in real projects.

---

## Reuse Strategy

This workflow is designed to transfer to production QA engagements with minimal rework.

### Phase template

| Phase | Activities | Artifacts |
|-------|------------|-----------|
| 1 — Discover | Requirements, risks, ACs | `project-info.md`, risk register |
| 2 — Design | Manual cases, RTM, test data | CSV, `test-data/`, ai-prompts |
| 3 — Automate smoke | API then UI smoke | Tagged specs, README commands |
| 4 — Automate regression | Negatives + E2E depth | Regression specs, assertions |
| 5 — Execute & report | Full run, HTML/JUnit, evidence | `reports/`, execution summary |
| 6 — Maintain | RTM updates, flake fixes | Git history per change |

### Reusable patterns

| Pattern | Benefit |
|---------|---------|
| Focused AI sessions per flow | Reduces hallucination and scope creep |
| `ai-prompts/` prompt log | Audit trail for AI-assisted QA |
| API service layer + UI page objects | Parallel UI/API delivery |
| `uiFlows` / `apiFlows` | One place to fix flow changes |
| Central assertions + schemas | Consistent validation, easy strengthening |
| Tag + project matrix (`@UI` / `@API` × smoke/regression) | Flexible CI pipelines |
| Dynamic test data on shared DB | Fewer collisions |
| Smoke-before-regression gate | Faster feedback loop |

### CI integration (future)

- `npm run test:api:smoke` on every PR (fast)
- `npm run test:ui:smoke` on merge to main
- Nightly `test:regression` with JUnit upload
- `report:copy` artifact for auditors

### What scales vs what customizes

| Reusable across projects | Customize per project |
|----------------------------|------------------------|
| Prism folder layout | Routes, locators, ACs |
| Fixture + flow pattern | Endpoint services |
| Reporter stack | Base URLs, credentials store |
| RTM structure | Requirement IDs |
| AI phase workflow | Domain vocabulary in prompts |

---

## Setup Summary (Assessment AI Workflow — 10 Points)

| # | Topic | Summary |
|---|-------|---------|
| 1 | **Context to AI** | Assessment brief, SUT URLs, ACs, existing framework files, focused chats |
| 2 | **Requirement analysis** | AI extracts flows/risks; human validates against Swagger and UI |
| 3 | **Test planning** | UI vs API split; smoke vs regression; 5–8 case cap per tier |
| 4 | **Manual test design** | CSV positive/negative/edge; AC traceability |
| 5 | **Automation design** | Playwright Prism: POM, services, tags, reusable flows |
| 6 | **Validation** | Live SUT runs; schema assertions; smoke-first gate |
| 7 | **Test data** | Faker, JSON fixtures, dynamic IDs, public defaults |
| 8 | **Debugging** | HTML report, trace, failure logs, focused AI debug sessions |
| 9 | **Sensitive information** | No real PII/secrets; synthetic data only |
| 10 | **Reuse** | Phased delivery, ai-prompts, RTM, API+UI parallel strategy |

---

## Smoke vs Regression Scope (Implemented)

### @Smoke

| Layer | Specs | Coverage |
|-------|-------|----------|
| UI (3) | Catalog, login, E2E purchase (cart → COD → invoice) | Critical purchase path |
| API (3) | Products, login token, E2E register→invoice | Contract health + E2E chain |

### @Regression

| Layer | Specs | Coverage |
|-------|-------|----------|
| UI (5) | Profile, catalog/cart, session, auth negative, checkout negative | AC1 + AC2 depth + negatives |
| API (5) | Register, cart mutations, token negative, invoice negative, invoice list | AC1 + AC2 + error paths |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `README.md` | Install, run commands, reports, troubleshooting |
| `test-plan.md` | Detailed test plan |
| `qa-risk-analysis.md` | Full risk register |
| `RTM.md` | Requirements traceability matrix |
| `test-suite-scope.md` | Case count compliance |
| `ai-prompts/` | Cursor AI prompt history |
| `PrismStructure/FRAMEWORK.md` | Framework technical detail |

---

*End of project-info.md*
