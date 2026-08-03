# Project Info — QA AI Practical Assessment

**Primary AI Tool(s) Used:** Cursor AI (Auto / Composer 2.5 for planning; Sonnet for automation)

**Application Under Test:** Practice Software Testing Toolshop – Checkout & Application Flow

**Assessment Start Date:** 29 July'26

**Submission Date:** 07 Aug'26

---

## Project Summary

This project validates the **Practice Software Testing Toolshop** (Sprint 5) — a small B2C ecommerce application for tools and hardware — across manual, UI, and API test tiers. The primary focus is the **customer purchase lifecycle**: user registration and login, product discovery, cart management (including multi-item and quantity updates), Cash on Delivery checkout, invoice generation (with the application's **double-confirm** UX), and verification under **My Invoices**.

Automation is implemented with **Playwright** using the **Prism Framework**, assisted by **Cursor AI** for requirement analysis, test design, automation structure, and debugging. Test coverage is organized into **@Smoke** (fast health checks) and **@Regression** (extended functional depth), with 5–8 test cases per tier (manual, UI, API) as scoped by the assessment.

**SUT URLs:**
- UI: https://practicesoftwaretesting.com/
- API: https://api.practicesoftwaretesting.com/api/documentation

---

## Tools Used

| Category | Tool |
|----------|------|
| AI assistant | Cursor AI |
| UI automation | Playwright (Prism Framework) |
| API automation | Playwright (API request context) |
| Language | JavaScript / TypeScript |
| Runtime | Node.js, npm |
| Browser | Chromium (default) |
| Test data | Faker / dynamic IDs / timestamp-based emails |
| Version control | Git (iterative commits) |
| Reporting | Playwright HTML report / execution evidence |

---

## Setup Summary

### 1. How you provide project and system-under-test context to the tool

- Share the assessment PDF and SUT URLs (UI + Swagger) as the initial context anchor.
- Reference **UI AC1/AC2** and **API AC1/AC2** explicitly when prompting.
- Point Cursor to existing Prism/Playwright structure, page objects, and config files before asking for new specs.
- Summarize prior chat sessions into `ai-prompts/` to avoid re-explaining context in every message.
- Use focused, single-task chats (Caveman approach): one flow per session (e.g., login negatives only, invoice API chain only).

### 2. How you use AI for requirement analysis

- Prompt AI to extract business flows, actors, features, dependencies, risks, and scope from the assessment doc and live SUT exploration.
- Cross-check AI output against Swagger (`/api/documentation`) and manual UI exploration (network tab).
- Validate assumptions (shared DB, double-confirm invoice, COD-only core path) before locking test scope.
- Document findings in this `project-info.md` Requirement Analysis section.

### 3. How you use AI for test planning and strategy (UI vs API, smoke vs regression)

- **UI:** End-user journeys, visibility, double-confirm UX, form validation, My Invoices.
- **API:** Contract validation, state machine (register → cart → invoice), faster setup/teardown, negative token/payload tests.
- **@Smoke:** Login, single add-to-cart, minimal COD checkout, API token + cart + invoice chain (~15–30 min).
- **@Regression:** Full AC1 + AC2 paths, multi-cart, filters/search, billing negatives, auth negatives.
- API used for data setup when UI login is slow; UI used when UX-specific behavior (double confirm) must be verified.

### 4. How you use AI for manual test case design (functional, edge, negative, non-functional)

- Generate CSV rows per flow: positive (happy path), negative (invalid login, empty cart, bad billing), edge (quantity boundaries, duplicate email).
- Review AI cases against AC traceability — each case maps to UI-AC1/AC2 or API-AC1/AC2.
- Add NFR-oriented manual checks where relevant (error message clarity, response time sanity).
- Cap at 5–8 manual cases; prioritize P1 features first.

### 5. How you use AI for automation design (framework choice, structure, data, reusable utilities)

- Follow **Prism Framework** conventions: page objects, spec files, shared auth/cart/invoice helpers.
- Tag specs with `@Smoke` and `@Regression`; separate commands in README.
- Chain API calls for dynamic `cart_id` and `invoice_id` — no hard-coded IDs.
- Reusable utilities: `login()`, `getBearerToken()`, `createCart()`, `addProductToCart()`, `generateInvoice()`.
- Use Sonnet-tier model for page objects and spec files; lighter models for planning docs.

### 6. How you validate and refine AI-generated test cases and scripts

- Execute against live SUT; compare API responses to Swagger schemas.
- Review assertions — AI often over-asserts or misses double-confirm step.
- Run smoke first; fix failures before expanding regression.
- Peer-style review: traceability matrix (requirement → case ID → spec name).
- Record validation notes in `ai-prompts/test-design.md`.

### 7. How you use AI for test data generation, environment assumptions, and API payloads

- Unique registration emails: `testuser_<timestamp>@example.com` to avoid shared-DB collisions.
- Default users for stable smoke: `customer@practicesoftwaretesting.com` / `welcome01`.
- Invoice payload template with dynamic `cart_id` from prior POST /carts response.
- Document environment assumptions: public Sprint 5 URLs, shared database, Cloudflare on UI.
- Prompt history for test data captured in `ai-prompts/test-data.md`.

### 8. How you use AI for debugging failing tests and interpreting logs

- Share Playwright trace, screenshot, and API response body with Cursor.
- Separate debugging chats per failure (e.g., TC-UI invoice double-confirm).
- Use AI to suggest locator fixes, wait strategies, and auth header issues — then verify manually.
- Log outcomes in `ai-prompts/automation-and-debugging.md` with Debugging Outcome field.

### 9. What information you avoid sharing unnecessarily with AI tools

- Real personal email, phone, or credentials beyond public SUT defaults.
- Internal company secrets, VPN details, or production URLs unrelated to this SUT.
- API keys or tokens from other systems.
- Full execution logs with sensitive data — summarize errors instead.

### 10. How you would reuse this QA workflow in a real project

- Phase 1: Requirements + risk → `project-info.md` + ai-prompts/requirements-and-planning.md
- Phase 2: Manual CSV + test-design prompts with validation notes
- Phase 3: Smoke automation → regression automation (API before or parallel to UI)
- Phase 4: Full suite run → execution evidence → README commands
- Reuse: focused chats, summarize-to-md skill, traceability matrix, API setup for UI tests, iterative git commits per phase.

---

## Requirement Analysis

### Business Flow

#### High-Level Context

Toolshop is a **B2C ecommerce platform** for tools and hardware. Customers discover products (with sustainability filters), build a cart, complete checkout using **Cash on Delivery (COD)**, and receive an invoice. The REST API mirrors the same commerce lifecycle for headless testing.

#### Core Happy Path

```
Discover Products → Authenticate → Add to Cart → Manage Cart → Checkout (COD) → Generate Invoice (×2 Confirm) → View My Invoices
```

| Step | Business Activity | UI | API |
|------|-------------------|-----|-----|
| 1 | Discover products (catalog, search, filters) | Home / listing | `GET /products`, `/categories`, `/brands` |
| 2 | Register or login | Register / Login | `POST /users/register`, `POST /users/login` |
| 3 | View product details | Product detail | `GET /products/{id}` |
| 4 | Add items to cart | Add to cart | `POST /carts`, add line items |
| 5 | Update cart (quantity, remove) | Cart page | `PUT` cart items, `GET /carts/{id}` |
| 6 | Checkout with billing | Checkout form | Billing fields in invoice payload |
| 7 | Select Cash on Delivery | Payment selection | `payment_method: cash-on-delivery` |
| 8 | Confirm invoice (**twice on UI**) | Confirm × 2 | `POST /invoices` |
| 9 | View order history | My Invoices | `GET /invoices` |

#### State Machine (API)

```
[User Created] → [Authenticated] → [Cart Created] → [Items Added] → [Cart Verified] → [Invoice Generated] → [Invoice Listed]
```

#### Exception Flows

| Flow | Description |
|------|-------------|
| Guest browse | Catalog without login; purchase requires auth |
| Invalid login | Wrong credentials → error, no session/token |
| Invalid registration | Duplicate email, weak password → rejected |
| Empty cart checkout | Blocked or error |
| Invalid billing | Missing/invalid fields → validation error |
| Invalid API token | Protected endpoints reject request |
| Invalid invoice request | Bad `cart_id` or payload → API error |

---

### Actors

| Actor | Role | Auth Level |
|-------|------|------------|
| **Guest** | Browse catalog without login | None |
| **Registered Customer** | Register, cart, checkout, invoices | Bearer token / session |
| **Returning Customer** | Login, repeat purchase, view invoices | Bearer token / session |
| **Admin** | Admin data, reports, DELETE ops | Admin bearer token |
| **QA Engineer** | Execute manual + automated tests | Test accounts |

**Default test users (shared public environment):**

| User | Email | Password |
|------|-------|----------|
| Customer 1 | `customer@practicesoftwaretesting.com` | `welcome01` |
| Customer 2 | `customer2@practicesoftwaretesting.com` | `welcome01` |
| Admin | `admin@practicesoftwaretesting.com` | `welcome01` |

---

### Features

| ID | Feature | UI | API | Priority |
|----|---------|-----|-----|----------|
| F-01 | User registration | ✓ | ✓ | P1 |
| F-02 | User login / logout | ✓ | ✓ | P1 |
| F-03 | Profile view / update | ✓ | ✓ | P2 |
| F-04 | Product catalog listing | ✓ | ✓ | P1 |
| F-05 | Product search | ✓ | ✓ | P2 |
| F-06 | Filter (category, brand, price, eco) | ✓ | ✓ | P2 |
| F-07 | Sort (name, price, CO₂ rating) | ✓ | ✓ | P2 |
| F-08 | Product detail view | ✓ | ✓ | P2 |
| F-09 | Add to cart | ✓ | ✓ | P1 |
| F-10 | Update cart quantity | ✓ | ✓ | P1 |
| F-11 | Remove cart item | ✓ | ✓ | P2 |
| F-12 | View cart | ✓ | ✓ | P1 |
| F-13 | Checkout — billing details | ✓ | ✓ | P1 |
| F-14 | Payment — Cash on Delivery | ✓ | ✓ | P1 |
| F-15 | Invoice generation (double confirm UI) | ✓ | ✓ | P1 |
| F-16 | My Invoices — list & detail | ✓ | ✓ | P1 |
| F-17 | Contact / messages | ✓ | ✓ | P3 |
| F-18 | Reports | — | ✓ | P3 |
| F-19 | Brands / categories (read) | ✓ | ✓ | P3 |

**Assessment AC mapping:**

| AC | Features |
|----|----------|
| UI AC1 | F-01, F-02, F-03 |
| UI AC2 | F-04–F-16 |
| API AC1 | F-01, F-02, F-09, F-12 |
| API AC2 | F-04, F-09–F-12, F-15, F-16 |

---

### Dependencies

#### Technical

| Dependency | Impact if unavailable |
|------------|------------------------|
| UI: `practicesoftwaretesting.com` | All UI tests blocked |
| API: `api.practicesoftwaretesting.com` | All API tests blocked |
| OpenAPI / Swagger | Contract design blocked |
| Cloudflare on UI | UI automation may flake |
| Shared public database | Data collisions, flaky tests |
| Playwright + Prism | Automation delivery blocked |
| Node.js / npm | Cannot execute tests |

#### Functional / Data

| Dependency | Required for |
|------------|--------------|
| Valid product IDs | Add to cart, checkout, invoice |
| Login → `access_token` | Cart create, protected calls |
| Valid `cart_id` with items | Invoice generation |
| Billing payload fields | `POST /invoices` success |
| `payment_method: cash-on-delivery` | COD checkout |
| Authenticated session (UI) | Checkout, My Invoices |

---

### Risks

| ID | Risk | Probability | Impact | Mitigation |
|----|------|-------------|--------|------------|
| R-01 | Shared DB — duplicate users, stale carts | High | Medium | Unique emails; API setup/teardown |
| R-02 | Cloudflare blocks headless UI | Medium | High | Retries; API setup fallback |
| R-03 | Double-confirm invoice missed | Medium | High | Explicit test step in page object |
| R-04 | Hard-coded cart/product IDs | High | High | Chain API calls; runtime IDs |
| R-05 | Token expiry mid-suite | Low | Medium | Re-auth helper |
| R-06 | AI wrong endpoints/assertions | Medium | High | Human review vs Swagger |
| R-07 | Scope creep (messages, reports) | Medium | Medium | Stick to In Scope |
| R-08 | Flaky filter/sort selectors | Medium | Medium | Resilient locators; API backup |
| R-09 | Time box (5–10 hours) | High | Medium | Smoke first; phased delivery |
| R-10 | PII in prompts/git | Low | High | Synthetic data only |

---

### In Scope

| Area | Coverage |
|------|----------|
| UI authentication | Register, login, profile (AC1) |
| UI catalog | Listing, search, filter, sort, detail |
| UI cart | Add, update quantity, remove, view |
| UI checkout | Billing, COD payment |
| UI invoice | Double-confirm generation, My Invoices |
| API auth | Register, login, bearer token |
| API catalog | GET products (list, search, filters) |
| API cart | Create, add/update, verify |
| API invoice | POST (COD), GET invoices |
| Negatives | Invalid login, registration, empty cart, bad billing, bad token, invalid payload |
| Test tiers | Manual CSV, UI `@Smoke`/`@Regression`, API `@Smoke`/`@Regression` |
| Artifacts | project-info, README, reports, ai-prompts, iterative git |

---

### Out of Scope

| Area | Reason |
|------|--------|
| Bug-hunt environment (`with-bugs`) | Not core SUT |
| API v1–v4 | Sprint 5 only |
| Full admin UI regression | Not in core ACs |
| All `/reports` endpoints | Stretch only |
| DELETE / admin destruction | Optional stretch |
| Security / penetration testing | Beyond functional assessment |
| Performance / load testing | Not in AC |
| Cross-browser matrix | Default Chromium |
| Mobile/responsive certification | Not required |
| Third-party payment gateways | COD only |
| Exhaustive catalog permutations | Case limit (5–8 per tier) |

---

### Test Objectives

| ID | Objective | Success Measure |
|----|-----------|-----------------|
| TO-01 | Validate UI AC1: register, login, profile | Manual + UI Pass |
| TO-02 | Validate UI AC2: E2E purchase + invoice | UI regression Pass |
| TO-03 | Validate API AC1: token + create cart | API smoke/regression Pass |
| TO-04 | Validate API AC2: products → cart → invoice | API E2E chain Pass |
| TO-05 | Valid state transitions (user → cart → invoice) | Positive cases Pass |
| TO-06 | Invalid transitions rejected | Negative cases Pass |
| TO-07 | Smoke suite &lt; 30 min from README | `@Smoke` runnable |
| TO-08 | Regression within case limit | `@Regression` Pass |
| TO-09 | Traceability req → case → automation | Mapping documented |
| TO-10 | Runnable automation (minimal manual setup) | README commands work |
| TO-11 | Execution evidence, all Passed | Reports in repo |
| TO-12 | Responsible AI workflow documented | ai-prompts/ complete |

---

### Acceptance Criteria

#### UI-AC1: User Registration & Login

| # | Criterion |
|---|-----------|
| 1 | New user registers with valid details |
| 2 | User logs in with registered credentials |
| 3 | Profile displays correct user information |
| 4 | Invalid login rejected with error |
| 5 | Invalid registration rejected (duplicate email, weak password) |

#### UI-AC2: End-to-End Purchase Flow

| # | Criterion |
|---|-----------|
| 1 | User browses products |
| 2 | User adds multiple items to cart |
| 3 | User updates item quantity |
| 4 | Checkout completes with Cash on Delivery |
| 5 | Invoice requires **two Confirm clicks** |
| 6 | Invoice visible under My Invoices |
| 7 | Invoice details match order and billing |

#### API-AC1: User Authentication & Cart Creation

| # | Criterion |
|---|-----------|
| 1 | Register via `POST /users/register` |
| 2 | Login returns valid `access_token` |
| 3 | Bearer token works on protected endpoints |
| 4 | Cart created with `POST /carts` |
| 5 | Missing/invalid token rejected |

#### API-AC2: Product Selection & Invoice Generation

| # | Criterion |
|---|-----------|
| 1 | Products retrieved via `GET /products` |
| 2 | Products added to cart |
| 3 | Cart contents verified via `GET /carts/{id}` |
| 4 | Invoice generated via `POST /invoices` (COD) |
| 5 | Payload includes billing fields, `cart_id`, `payment_method` |
| 6 | Invalid payload rejected |

**Reference invoice POST body:**

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

### Priority

#### Feature Priority

| Priority | Features |
|----------|----------|
| **P1 — Critical** | F-01, F-02, F-04, F-09, F-10, F-12, F-13, F-14, F-15, F-16 |
| **P2 — High** | F-03, F-05, F-06, F-07, F-08, F-11 |
| **P3 — Medium** | F-17, F-18, F-19 |

#### Test Tiers

| Tier | Tag | Scope |
|------|-----|-------|
| Smoke | `@Smoke` | Login, single add-to-cart, COD checkout, double-confirm invoice, API token + cart + invoice |
| Regression | `@Regression` | Full AC1 + AC2, multi-cart, filters, negatives |

#### Suggested Case Allocation (5–8 per tier)

| Tier | Manual | UI | API |
|------|--------|-----|-----|
| Smoke | Login, add to cart, invoice confirm | Login → add → COD → invoice | Login → cart → invoice POST |
| Regression | Register, profile, multi-cart, negatives | AC1 + AC2 E2E + billing errors | AC1 + AC2 chain + token/payload negatives |

#### Execution Order

1. Requirement analysis (this document)
2. Manual smoke → manual regression
3. API smoke → API regression
4. UI smoke → UI regression
5. Execution reports + README + ai-prompts
6. Stretch: admin API, messages (if time permits)

---

### Traceability Summary

| Requirement | UI AC | API AC | Smoke | Regression |
|-------------|-------|--------|-------|------------|
| Registration & login | UI-AC1 | API-AC1 | Partial | ✓ |
| Profile verification | UI-AC1 | — | — | ✓ |
| Product browse | UI-AC2 | API-AC2 | ✓ | ✓ |
| Cart operations | UI-AC2 | API-AC1/AC2 | ✓ | ✓ |
| COD checkout | UI-AC2 | API-AC2 | ✓ | ✓ |
| Invoice (double confirm) | UI-AC2 | API-AC2 | ✓ | ✓ |
| My Invoices | UI-AC2 | API-AC2 | ✓ | ✓ |
| Negative / error paths | — | — | — | ✓ |

---

## Smoke vs Regression Scope

### @Smoke

| # | Scenario | Layer |
|---|----------|-------|
| 1 | Home/catalog loads with products | UI |
| 2 | Login with valid user | UI |
| 3 | Add one product to cart | UI |
| 4 | Login → COD checkout → double-confirm invoice → My Invoices | UI |
| 5 | API login returns `access_token` | API |
| 6 | API create cart with bearer token | API |
| 7 | API GET products | API |
| 8 | API chain: login → cart → add product → POST invoice | API |

### @Regression

| # | Scenario | Layer |
|---|----------|-------|
| 1 | Register new user + profile verification | UI / Manual |
| 2 | Login/register negatives | UI / API / Manual |
| 3 | Search + filter + sort | UI |
| 4 | Multi-item cart + quantity update + remove | UI / API |
| 5 | Checkout billing validation errors | UI / Manual |
| 6 | Empty cart checkout blocked | UI / Manual |
| 7 | Full E2E: register → browse → multi-cart → COD → invoice | UI |
| 8 | API negatives: bad token, invalid invoice payload | API |

---

*End of project-info.md*
