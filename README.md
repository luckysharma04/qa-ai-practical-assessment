# QA AI Practical Assessment — Toolshop

Manual functional testing and Playwright automation (UI + API) for the **Practice Software Testing Toolshop** (Sprint 5).

| Resource | URL |
|----------|-----|
| **UI (SUT)** | https://practicesoftwaretesting.com/ |
| **API** | https://api.practicesoftwaretesting.com |
| **API docs** | https://api.practicesoftwaretesting.com/api/documentation |

---

## Project Overview

This repository is a complete QA assessment deliverable covering:

- **Manual functional tests** — 8 cases (3 Smoke + 5 Regression) in CSV format
- **UI automation** — 8 Playwright specs (3 Smoke + 5 Regression) with Page Object Model
- **API automation** — 8 Playwright API specs (3 Smoke + 5 Regression) using `APIRequestContext`
- **Supporting artifacts** — test plan, risk analysis, RTM, AI prompt history, execution reports

**Test scope:** Registration, login, catalog search, cart, COD checkout, invoice generation, session management, and negative paths (invalid auth, empty cart, invalid billing).

**Default test user:** `customer@practicesoftwaretesting.com` / `welcome01`

**Tags:** `@Smoke`, `@Regression`, `@UI`, `@API` — used for filtered execution via Playwright projects and npm scripts.

---

## Framework

Automation lives in **`PrismStructure/`** — a **Prism-style Playwright framework** (JavaScript) with clear separation of concerns:

| Layer | Location | Role |
|-------|----------|------|
| **Page Objects** | `Pages/` | UI locators and actions (no assertions) |
| **UI tests** | `Tests/ui/smoke`, `Tests/ui/regression` | Thin specs mapped to RTM IDs |
| **API client** | `API/clients/ApiClient.js` | `APIRequestContext` wrapper |
| **API services** | `API/services/` | Auth, Cart, Product, Invoice endpoints |
| **API tests** | `API/tests/smoke`, `API/tests/regression` | Status + schema assertions |
| **Fixtures** | `Fixtures/testFixtures.js` | Injects pages, `uiFlows`, `apiServices` |
| **Utilities** | `Utils/` | Data generation, assertions, API flows, logging |
| **Config** | `Config/` | Base URLs, routes, payment methods, tags |
| **Test data** | `test-data/` + `Data/` | Shared JSON fixtures and runtime modules |

**Design patterns:** Page Object Model, service layer for API, reusable flows (`uiFlows`, `apiFlows`), centralized assertions (`assertions.js`, `apiAssertions.js`), and schema validation (`API/schemas/apiSchemas.js`).

See also: [`PrismStructure/FRAMEWORK.md`](./PrismStructure/FRAMEWORK.md) and [`PROJECT-STRUCTURE.md`](./PROJECT-STRUCTURE.md).

---

## Installation

### Prerequisites

- **Node.js** 18+ (20 recommended)
- **npm**
- Internet access (public SUT)
- **Git**

### Setup

```bash
# Clone the repository
git clone https://github.com/luckysharma04/qa-ai-practical-assessment
cd qa-ai-practical-assessment

# Install dependencies (root + PrismStructure via postinstall)
npm install

# Install Playwright Chromium browser
cd PrismStructure
npx playwright install chromium
cd ..
```

All test commands below can be run from the **repository root** without entering `PrismStructure/`.

---

## How to Run Smoke

Smoke tests are fast health checks tagged `@Smoke` (UI + API).

```bash
# All smoke tests (UI + API) — 6 tests
npm run test:smoke

# UI smoke only — 3 tests
npm run test:ui:smoke

# API smoke only — 3 tests
npm run test:api:smoke
```

| UI Smoke | Test ID |
|----------|---------|
| Catalog + search | TC-UI-SM-001 |
| Login | TC-UI-SM-002 |
| E2E purchase (cart, COD, invoice) | TC-UI-SM-003 |

| API Smoke | Test ID |
|-----------|---------|
| GET /products | TC-API-SM-001 |
| POST /users/login | TC-API-SM-002 |
| E2E purchase lifecycle | TC-API-SM-003 |

---

## How to Run Regression

Regression tests provide broader coverage tagged `@Regression` (UI + API).

```bash
# All regression tests (UI + API) — 10 tests
npm run test:regression

# UI regression only — 5 tests
npm run test:ui:regression

# API regression only — 5 tests
npm run test:api:regression
```

| UI Regression | Test ID |
|---------------|---------|
| Registration + profile | TC-UI-RG-001 |
| Catalog, cart, quantity | TC-UI-RG-002 |
| Session + logout | TC-UI-RG-003 |
| Invalid login / duplicate register | TC-UI-RG-004 |
| Checkout negatives | TC-UI-RG-005 |

| API Regression | Test ID |
|----------------|---------|
| POST /users/register | TC-API-RG-001 |
| Cart add / verify | TC-API-RG-002 |
| Invalid bearer token | TC-API-RG-003 |
| Invalid invoice payload | TC-API-RG-004 |
| Invoice list after order | TC-API-RG-005 |

---

## How to Run API

API tests use Playwright `APIRequestContext` (no browser UI interaction).

```bash
# All API tests (smoke + regression) — 8 tests
npm run test:api

# API smoke
npm run test:api:smoke

# API regression
npm run test:api:regression
```

**API flow (E2E smoke):** Register → Login → Capture token → Create cart → Get products → Add product → Verify cart → Generate invoice → Verify invoice → Delete cart.

**Base URL:** `https://api.practicesoftwaretesting.com` (configured in `PrismStructure/Config/env.js`).

---

## Folder Structure

```
qa-ai-practical-assessment/
├── FunctionalTestCase.csv           # Manual test cases (CSV, root)
├── PrismStructure/                  # Playwright automation framework
│   ├── API/
│   │   ├── clients/                 # ApiClient (APIRequestContext)
│   │   ├── services/                # AuthApi, CartApi, ProductApi, InvoiceApi
│   │   ├── schemas/                 # Response schema validators
│   │   └── tests/
│   │       ├── smoke/               # @Smoke @API
│   │       └── regression/          # @Regression @API
│   ├── Pages/                       # UI Page Objects
│   ├── Tests/ui/
│   │   ├── smoke/                   # @Smoke @UI
│   │   └── regression/              # @Regression @UI
│   ├── Fixtures/                    # Custom Playwright fixtures
│   ├── Utils/                       # Flows, assertions, data generator
│   ├── Data/                        # Automation data modules
│   ├── Config/                      # env.js, constants.js
│   ├── Reports/                     # Generated reports & artifacts
│   ├── scripts/                     # copy-reports.js
│   ├── playwright.config.js
│   └── package.json
├── test-data/                       # Shared JSON fixtures
├── reports/                         # Submission copies of reports
├── screenshots/                     # Manual / failure screenshots
├── ai-prompts/                      # Cursor AI prompt history
├── project-info.md                  # Requirements & AI workflow
├── test-plan.md                     # Test plan
├── qa-risk-analysis.md              # Risk register
├── RTM.md / RTM.csv                 # Traceability matrix
├── package.json                     # Root npm scripts
└── README.md                        # This file
```

---

## Reports

Reports are generated automatically on every test run.

### Generated outputs

| Artifact | Path | Description |
|----------|------|-------------|
| **HTML report** | `PrismStructure/Reports/playwright-report/` | Interactive report with traces, screenshots, videos |
| **JSON results** | `PrismStructure/Reports/test-results.json` | Machine-readable suite summary |
| **JUnit XML** | `PrismStructure/Reports/junit-results.xml` | CI integration (Jenkins, Azure DevOps) |
| **Failure logs** | `PrismStructure/Reports/failure-logs/` | `failures.log` + `failures.json` |
| **Screenshots** | `PrismStructure/Reports/test-results/` | Captured on failure |
| **Videos** | `PrismStructure/Reports/test-results/` | Retained on failure |
| **Traces** | `PrismStructure/Reports/test-results/` | Retained on failure — open from HTML report |

### View reports

```bash
# Open HTML report in browser
npm run report

# Copy HTML, JSON, JUnit, failure logs to reports/ for submission
npm run report:copy
```

### Submission workflow

```bash
npm run test:smoke          # Run tests
npm run report              # Review failures (if any)
npm run report:copy         # Package artifacts into reports/
```

Fill in `reports/execution-summary.template.md` with pass/fail counts.

---

## Troubleshooting

### `npm install` fails

- Ensure Node.js 18+ is installed: `node -v`
- Delete `node_modules` in root and `PrismStructure/`, then run `npm install` again

### Browser not found / `Executable doesn't exist`

```bash
cd PrismStructure
npx playwright install chromium
```

### Tests timeout on UI flows

- Public SUT can be slow — increase timeout in `playwright.config.js` if needed
- Run with a single worker (already configured: `workers: 1`)
- Invoice/checkout tests may need up to 120s — some regression specs set `test.setTimeout(120_000)`

### Empty cart on checkout

- Do **not** navigate to `/cart` before checkout — it can clear the session cart
- Verify cart on `/checkout` via `openWithItems()`

### Registration failures

- Use dynamic email/password from `dataGenerator.js` — SUT rejects common passwords
- Phone field must be numeric only

### API cart add returns 404

- Use `POST /carts/{cartId}` with `{ product_id, quantity }` — not `/carts/{id}/items`

### Flaky UI tests (invoice, login)

- Checkout confirm requires **two** finish clicks (assessment requirement)
- Re-run failed spec individually: `cd PrismStructure && npx playwright test Tests/ui/smoke/invoice.spec.js`

### Reports not updating

- Reports are overwritten each run — ensure tests completed before opening HTML report
- Run `npm run report:copy` after the latest test run

### Windows PowerShell grep issues

- Use npm scripts (`npm run test:ui:smoke`) instead of combining grep patterns manually

---

## Future Improvements

| Area | Improvement |
|------|-------------|
| **CI/CD** | GitHub Actions workflow with matrix for `@UI` / `@API` projects and JUnit upload |
| **Parallel execution** | Increase workers when SUT stability allows; isolate dynamic test data |
| **Cross-browser** | Add Firefox and WebKit projects for UI regression |
| **API coverage** | Stretch endpoints (brands, categories, messages) from API docs |
| **Visual regression** | Screenshot comparison for catalog and checkout pages |
| **Allure** | Optional Allure reporter for richer dashboards |
| **Test data** | Database seed/cleanup service or dedicated test tenant |
| **Accessibility** | axe-core integration on key UI flows |
| **Performance** | Lightweight API response-time thresholds on smoke suite |
| **Manual tests** | Migrate CSV to TestRail / Zephyr with linked automation IDs |

---

## Additional Resources

| Document | Purpose |
|----------|---------|
| [`project-info.md`](./project-info.md) | Requirements, scope, AI workflow |
| [`test-plan.md`](./test-plan.md) | Full test plan |
| [`RTM.md`](./RTM.md) | Requirements traceability |
| [`qa-risk-analysis.md`](./qa-risk-analysis.md) | Risk register |
| [`test-suite-scope.md`](./test-suite-scope.md) | Case count compliance |
| [`ai-prompts/`](./ai-prompts/) | Cursor AI prompt history |

---

## License

Assessment submission — Practice Software Testing demo application.
