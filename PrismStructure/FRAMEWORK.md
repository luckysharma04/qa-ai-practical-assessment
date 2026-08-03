# Playwright Prism Framework — Toolshop

Scalable JavaScript test automation using **Page Object Model (POM)**, **service-layer API clients**, and **Playwright fixtures** for the Practice Software Testing Toolshop application.

---

## Folder Structure

```
PrismStructure/
├── Pages/              # UI Page Objects (POM layer)
├── Tests/              # UI test specifications
├── API/                # API clients, services, and API tests
├── Fixtures/           # Custom Playwright test fixtures
├── Utils/              # Cross-cutting helpers
├── Data/               # Static test data and fixtures
├── Config/             # Environment and constants
├── Reports/            # Generated execution reports and artifacts
├── playwright.config.js
├── package.json
└── FRAMEWORK.md
```

---

## Pages/

**Purpose:** Page Object Model layer for the **UI**. Each file represents one screen or cohesive UI module.

**Contains:**
- `BasePage.js` — shared navigation, waits, and base behavior
- `LoginPage.js`, `HomePage.js`, `CheckoutPage.js`, etc. — locators and user actions only

**Rules:**
- **No test assertions** in page objects (optional light self-checks only if your team allows)
- **No test data** hard-coded — import from `Data/` or receive via method args
- Locators use resilient strategies: `getByRole`, `getByLabel`, `getByPlaceholder`
- Complex flows (e.g. `confirmInvoiceTwice()`) live here as reusable methods

**Scales by:** Adding new page files per route/module without changing tests.

---

## Tests/

**Purpose:** **UI test specifications** — describes *what* to verify, not *how* to find elements.

**Structure:**
```
Tests/
└── ui/
    ├── smoke/          # @Smoke tagged specs (fast health checks)
    └── regression/     # @Regression tagged specs (broader coverage)
```

**Rules:**
- Import `test` and `expect` from `Fixtures/testFixtures.js` (not directly from `@playwright/test`)
- Tag suites with `@Smoke` or `@Regression` for grep-based execution
- Map test names to RTM IDs (e.g. `TC-UI-SM-001`)
- Keep specs thin: call page object methods, assert outcomes

**Scales by:** New spec files per feature area; parallel workers when SUT allows.

---

## API/

**Purpose:** **API automation layer** — HTTP clients, endpoint services, and API test specs.

**Structure:**
```
API/
├── clients/            # ApiClient — HTTP transport, auth headers
├── services/             # AuthApi, CartApi, InvoiceApi, ProductApi
└── tests/
    ├── smoke/
    └── regression/
```

**Rules:**
- **Clients** handle base URL, headers, bearer token
- **Services** map to REST resources (`/users`, `/carts`, `/invoices`)
- Chain dynamic IDs: register → token → cart → invoice
- API tests use the same `Fixtures/testFixtures.js` for `apiClient` and `authenticatedApi`

**Scales by:** New service class per API resource; tests stay readable.

---

## Fixtures/

**Purpose:** **Dependency injection** for Playwright — wires page objects and API services into tests.

**Contains:**
- `testFixtures.js` — extends `@playwright/test` with:
  - `loginPage`, `homePage`, `checkoutPage`
  - `apiClient` (unauthenticated)
  - `authenticatedApi` (pre-logged-in API bundle)

**Why it matters:**
- Tests do not manually construct page objects or API clients
- Shared setup (auth token, browser context) is centralized
- Easy to add `loggedInPage` fixture with storage state later

**Scales by:** New fixtures for admin user, guest session, or API-only suites.

---

## Utils/

**Purpose:** **Helpers** that are not tied to a single page or API resource.

**Contains:**
- `dataGenerator.js` — unique emails, faker-based registration data
- `logger.js` — step/API logging (never log tokens or passwords)

**Rules:**
- No UI locators here
- No endpoint paths here (use `Config/` and `API/services/`)

**Scales by:** Adding wait helpers, retry wrappers, date formatters, CSV readers.

---

## Data/

**Purpose:** **Test data** separated from test logic — static accounts, billing templates, JSON payloads.

**Contains:**
- `users.js` — default customer, admin (public SUT credentials)
- `billing.js` — valid billing aligned with assessment invoice payload

**Rules:**
- Dynamic data uses `Utils/dataGenerator.js`
- Never commit real PII or private credentials
- UI field names vs API field names can both live here

**Scales by:** `environments/`, `products.json`, locale-specific data files.

---

## Config/

**Purpose:** **Configuration** — environment URLs, routes, tags, timeouts (not secrets).

**Contains:**
- `env.js` — `UI_BASE_URL`, `API_BASE_URL` with env var overrides
- `constants.js` — routes, payment methods, `@Smoke` / `@Regression` tag strings

**Scales by:** `staging.js` / `prod.js` profiles, feature flags, timeout profiles.

---

## Reports/

**Purpose:** **Generated output** from test runs — not source code.

**Contains (after execution):**
- `playwright-report/` — HTML report
- `test-results/` — screenshots, traces, videos on failure
- `test-results.json` — JSON summary for CI

**Note:** Listed in `.gitignore`; use `npm run report` to open HTML report locally. Copy screenshots into submission evidence folder if required.

---

## Execution Commands

```bash
cd PrismStructure
npm install
npx playwright install chromium

npm run test:smoke          # All @Smoke (UI + API)
npm run test:regression     # All @Regression
npm run test:ui:smoke       # UI smoke only
npm run test:api:smoke      # API smoke only
npm run report              # Open HTML report
```

---

## Design Principles (Prism)

| Principle | Implementation |
|-----------|----------------|
| Separation of concerns | Pages = UI actions, Tests = scenarios, API = contracts |
| Reusability | Fixtures inject shared objects |
| Traceability | Test IDs match `RTM.md` |
| Scalability | New module = new Page + Service + spec folder |
| Maintainability | Locator changes isolated to Pages |
| Assessment compliance | 5–8 cases per UI/API tier with `@Smoke` / `@Regression` |

---

## Extension Checklist

- [ ] Add `Pages/RegisterPage.js`, `CartPage.js`, `InvoicesPage.js`
- [ ] Complete UI smoke spec `TC-UI-SM-003` (E2E checkout)
- [ ] Add API regression specs `TC-API-RG-001` – `TC-API-RG-005`
- [ ] Add `storageState` fixture for faster UI login
- [ ] Wire CI to upload `Reports/playwright-report`
