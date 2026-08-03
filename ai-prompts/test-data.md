# AI Prompts — Test Data

Record of Cursor AI prompts for test data design, Faker-based JSON generation, and runtime data utilities.

**Application:** Practice Software Testing Toolshop v5.0  
**Data root:** `test-data/` (shared) + `PrismStructure/Utils/dataGenerator.js` (runtime)  
**Date:** 03 August 2026

---

## Data inventory

| File | Purpose |
|------|---------|
| `users.json` | Public SUT default accounts (smoke login) |
| `users-valid.json` | Faker valid users + static SUT accounts |
| `users-invalid.json` | Invalid login / registration cases |
| `addresses.json` | Assessment billing reference + valid addresses (UI + API shapes) |
| `billing.json` | UI/API billing shortcuts |
| `products.json` | Search terms, filter examples, synthetic catalog notes |
| `negative-data.json` | Checkout negatives + API negative payloads |
| `boundary-values.json` | Cart quantity boundaries |
| `invoice-payload.example.json` | Assessment `POST /invoices` template |
| `test-data-manifest.json` | Generator output index |
| `generate-test-data.js` | Regenerates JSON with Faker (`faker.seed(20260803)`) |

**Runtime:** `PrismStructure/Utils/dataGenerator.js` — loads JSON + dynamic timestamps for automation.

---

## Entry 1 — Assessment data strategy (planning)

### Prompt

(Implicit in test plan / requirement analysis) Define test data approach for public shared SUT: registration, billing, API payloads, dynamic IDs.

### Summary

Test plan **Data Strategy** section defined:

- **Static smoke users** — `customer@practicesoftwaretesting.com` / `welcome01`
- **Dynamic registration** — `testuser_<timestamp>@example.com` to avoid shared-DB collisions
- **No hard-coded cart/product IDs** — chain API calls at runtime
- **Assessment billing** — Zoey Shore / Hesselbury / Florida / TG / 1234AA for invoice POST
- **Synthetic data only** — no real PII

### Validation

- Aligned with `project-info.md` Test Data section and risk R-01 (shared DB).
- Manual CSV preconditions reference timestamp emails (`TC-M-004`).

---

## Entry 2 — Initial scaffold data files

### Prompt

Generate complete project folder structure including `test-data/` with `users.json`, `billing.json`, `invoice-payload.example.json`.

### Summary

Created minimal JSON for evaluators and early automation:

- `users.json` — default, secondary, admin public credentials
- `billing.json` — UI + API billing field maps
- `invoice-payload.example.json` — COD invoice body with `<dynamic-from-POST-carts>`
- `test-data/README.md` — file purpose index

### Validation

- Credentials match Toolshop public documentation / login page.
- Invoice example matches assessment PDF POST body.
- Used in smoke login and early checkout specs before Faker expansion.

---

## Entry 3 — Faker JSON generation (primary prompt)

### Prompt

Generate realistic test data using Faker.

Include:

- User
- Address
- Products
- Invalid Users
- Negative Data
- Boundary Values

Save data as JSON.

### Summary

Created `test-data/generate-test-data.js` and generated committed JSON files:

| Generator output | Contents |
|------------------|----------|
| `users-valid.json` | 5 Faker users + `staticSutAccounts`; each user includes `apiRegisterPayload` |
| `addresses.json` | `assessmentReference` + 5 valid addresses with `ui` and `api` field maps |
| `products.json` | Search terms (hammer, saw, drill, etc.), invalid search strings, synthetic catalog items, filter examples |
| `users-invalid.json` | Login failures (wrong password, unknown email, empty password, padded email); registration failures (duplicate, bad email, weak password, bad phone) |
| `negative-data.json` | UI checkout negatives (empty cart, missing billing, single confirm); API negatives (no token, invalid token, bad cart id, missing billing, wrong payment method) |
| `boundary-values.json` | Cart min/max quantity, zero, negative, non-numeric |
| Regenerated `users.json`, `billing.json`, `invoice-payload.example.json` | Synced with assessment reference |

**Seed:** `faker.seed(20260803)` for reproducible committed JSON.

### Validation

- Ran `node test-data/generate-test-data.js` — all files written; `test-data-manifest.json` lists outputs.
- `meta.generatedAt` timestamps on each file for audit trail.
- Product file explicitly notes **IDs are dynamic** — automation must not rely on synthetic product IDs alone.

---

## Entry 4 — Runtime `dataGenerator.js` (automation)

### Prompt

(Evolution during UI/API automation) Need dynamic emails, registration payloads, and helpers to load negative cases from JSON.

### Summary

Implemented `PrismStructure/Utils/dataGenerator.js`:

| Function | Source / behavior |
|----------|-------------------|
| `uniqueEmail()` | `testuser_${Date.now()}@example.com` |
| `registrationUser()` | Faker names/address + numeric phone + `RegPass_{stamp}!xY9` |
| `apiRegistrationPayload()` | API-shaped body from `registrationUser()` |
| `getApiInvoiceBilling()` | From `addresses.json` assessment reference |
| `getAssessmentBilling()` | UI + API billing wrapper |
| `getInvalidLoginCase(id)` | `users-invalid.json` |
| `getNegativeApiCase(id)` | `negative-data.json` |
| `getSearchTerm(index)` | `products.json` |
| `getBoundaryCart()` | `boundary-values.json` |

### Validation

- **Registration automation:** weak password `TestPass123!` rejected by SUT → switched to timestamp-based strong passwords in `registrationUser()`.
- **Phone:** `faker.string.numeric(10)` — UI registration passes; formatted phone strings failed validation.
- **API register:** `POST /users/register` returns `201` with `apiRegistrationPayload()` in E2E smoke.
- **Negative API specs:** `getNegativeApiCase('negative-api-invalid-token')` etc. produce expected `401`/`422` against live API.

---

## Entry 5 — Assessment billing for checkout and invoice

### Prompt

(From assessment AC / invoice POST example) Use exact billing fields for COD checkout and `POST /invoices`.

### Summary

`addresses.json` → `assessmentReference`:

| API field | Value |
|-----------|-------|
| `billing_street` | Zoey Shore |
| `billing_city` | Hesselbury |
| `billing_state` | Florida |
| `billing_country` | TG |
| `billing_postal_code` | 1234AA |

UI mapping: `street`, `city`, `state`, `country` (`TG`), `postalCode`, `houseNumber` (`42` in checkout helper).

### Validation

- API `POST /invoices` with `getApiInvoiceBilling()` → `201`; schema assertions match returned billing fields.
- UI invoice smoke: `getAssessmentBilling().ui` used in `completeCodCheckout`; My Invoices shows city/postal code.
- **Note:** Default customer profile may pre-fill different street on checkout — automation uses `expectBillingFieldsPopulated` rather than exact street match when profile overrides fill.

---

## Entry 6 — Negative and boundary data for regression

### Prompt

(From manual negative/edge CSV design + API regression) Invalid login, duplicate registration, empty cart, invalid invoice payloads, cart quantity edges.

### Summary

Consolidated into JSON consumed by specs:

- `users-invalid.json` — `auth-negative.spec.js` uses `invalid-login-wrong-password`
- `negative-data.json` — `checkout-negative.spec.js` themes; API specs use `negative-api-*` cases with `expectedStatus` arrays
- `boundary-values.json` — cart quantity limits for future/manual edge runs

Duplicate registration test uses **live** `defaultCustomer.email` (known existing user), not only JSON static email.

### Validation

| Data ID | Spec | Live result |
|---------|------|-------------|
| `invalid-login-wrong-password` | TC-UI-RG-004 | Login rejected, alert visible |
| `negative-api-no-token` | TC-API-RG-003 | `401` + Unauthorized message |
| `negative-api-wrong-payment-method` | TC-API-RG-004 | `422` payment_method error |
| `negative-single-confirm-invoice` | TC-UI-RG-005 | Invoice row count unchanged |

---

## Entry 7 — Dynamic product and cart IDs

### Prompt

(API automation) Cart and invoice require runtime `product_id` and `cart_id` — no static catalog IDs.

### Summary

- `ProductApi.getFirstInStockProductId()` — `GET /products`, pick `in_stock === true`
- Cart ID from `POST /carts` response body
- `invoice-payload.example.json` keeps `cart_id: "<dynamic-from-POST-carts>"` as documentation only

`products.json` synthetic IDs marked **not for live API** in meta note.

### Validation

- E2E API smoke passes without hard-coded ULIDs.
- Probed live API: product IDs are 26-char alphanumeric; cart add uses product id from list response.
- UI `ProductPage` scouts in-stock products via UI/API wait on add-to-cart.

---

## Entry 8 — Search and catalog test data

### Prompt

(Product search smoke/regression) Stable search terms for catalog tests.

### Summary

`products.json` → `searchTerms.valid`: includes `hammer`, `saw`, `drill`, plus Faker-generated terms. `search.spec.js` and `catalog-cart.spec.js` use `getSearchTerm(1)` → `hammer`.

### Validation

- Live UI search for `hammer` returns at least one product name containing term (assertion checks **any** row, not first row only).
- Invalid search terms in JSON (`zzznonexistentproduct999`) reserved for manual/edge — not in automated smoke path.

---

## How data was validated (overall)

### 1. Static JSON review

- Cross-checked assessment PDF invoice POST body against `addresses.json` / `invoice-payload.example.json`.
- Verified public credentials against Toolshop login documentation.
- Confirmed negative case `expected` fields align with manual case intent (`TC-M-007`, `TC-M-008`).

### 2. Generator execution

```bash
node test-data/generate-test-data.js
```

- All manifest files produced without error.
- Re-seeding (`faker.seed`) keeps committed JSON stable for submission.

### 3. Live SUT execution (automation)

| Data type | Validation method |
|-----------|-------------------|
| Registration | UI + API specs pass with `registrationUser()` / `apiRegistrationPayload()` |
| Login | Smoke uses `defaultCustomer` — `TC-API-SM-002`, `TC-UI-SM-LOGIN` |
| Billing / invoice | API schema asserts billing fields; UI invoice list shows city/postal |
| Negative login | `expectLoginRejected` after wrong password case |
| API auth negative | Status + `Unauthorized` body schema |
| API invoice negative | Status one-of + Laravel field errors in body |
| Dynamic IDs | No 404 on cart add after endpoint fix; products from live GET |

### 4. Schema assertion layer

After assertion hardening, API responses validated against expected shapes — indirectly confirms billing and token data produced valid server state (invoice `INV-*` numbers, cart line items with price > 0).

### 5. Debugging-driven data fixes

| Issue discovered | Data fix |
|------------------|----------|
| Password rejected as leaked/common | Unique `RegPass_{timestamp}!xY9` in `registrationUser()` |
| Phone validation failure | Numeric-only phone string |
| Wrong API cart endpoint | Data flow still dynamic; no JSON change — runtime chain validated |
| Profile pre-fills billing | Tests assert populated fields, not fixed assessment street on checkout |

### 6. Security / hygiene check

- No real personal emails or secrets in JSON (only public SUT accounts).
- No committed bearer tokens or `.env` files.
- `users.json` notes: use timestamp emails for new registrations.

---

## Usage in automation (quick reference)

```javascript
const { registrationUser, getApiInvoiceBilling, getNegativeApiCase } =
  require('../Utils/dataGenerator');

const user = registrationUser();           // dynamic UI registration
const billing = getApiInvoiceBilling();  // assessment API billing
const badToken = getNegativeApiCase('negative-api-invalid-token');
```

```bash
# Regenerate committed JSON (optional refresh)
node test-data/generate-test-data.js
```

---

## Gaps and manual follow-up

| Item | Status |
|------|--------|
| Manual CSV execution with JSON preconditions | Status column still `Not Executed` until manual run |
| Network failure negative (TC-NG-005) | Data defined; not automated (browser offline simulation) |
| Boundary cart extremes | JSON present; partial coverage in UI quantity update only |
| Admin user data | In `users-valid.json`; admin flows out of core scope |

---

*Related: `ai-prompts/automation-and-debugging.md` (registration password/phone fixes), `ai-prompts/test-design.md` (negative case consolidation), `project-info.md` (Test Data section).*
