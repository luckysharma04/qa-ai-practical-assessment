# Requirements Traceability Matrix (RTM)

**Application:** Practice Software Testing — Toolshop v5.0  
**Related artifacts:** `project-info.md`, `FunctionalTestCase.csv`, `test-suite-scope.md`  
**Version:** 1.0

---

## Automation ID Reference

### UI automation (implemented — Playwright `@Smoke` / `@Regression`)

| ID | Tier | Maps to manual |
|----|------|----------------|
| TC-UI-SM-001 | @Smoke | TC-M-001 |
| TC-UI-SM-002 | @Smoke | TC-M-002 |
| TC-UI-SM-003 | @Smoke | TC-M-003 |
| TC-UI-RG-001 | @Regression | TC-M-004 |
| TC-UI-RG-002 | @Regression | TC-M-005 |
| TC-UI-RG-003 | @Regression | TC-M-006 |
| TC-UI-RG-004 | @Regression | TC-M-007 |
| TC-UI-RG-005 | @Regression | TC-M-008 |

**UI total:** 8 (3 Smoke + 5 Regression) — within 5–8 limit.

### API automation (implemented — Playwright `@Smoke` / `@Regression`)

| ID | Tier | Coverage |
|----|------|----------|
| TC-API-SM-001 | @Smoke | GET /products |
| TC-API-SM-002 | @Smoke | POST /users/login → access_token |
| TC-API-SM-003 | @Smoke | Cart create → add item → POST /invoices (COD) |
| TC-API-RG-001 | @Regression | POST /users/register |
| TC-API-RG-002 | @Regression | Cart add/update → GET /carts/{id} verify |
| TC-API-RG-003 | @Regression | Invalid/missing bearer token |
| TC-API-RG-004 | @Regression | Invalid invoice payload |
| TC-API-RG-005 | @Regression | GET /invoices — list/detail after order |

**API total:** 8 (3 Smoke + 5 Regression) — within 5–8 limit.

---

## Traceability Matrix

| Requirement | Acceptance Criteria | Manual Test Case | Smoke Test | Regression Test | API Test | Automation Status |
|-------------|---------------------|------------------|------------|-----------------|---------|-------------------|
| REQ-01 User Registration | UI-AC1-1: New user registers with valid details | TC-M-004 | — | TC-UI-RG-001 | TC-API-RG-001 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-01 User Registration | UI-AC1-5: Invalid registration rejected (duplicate email) | TC-M-007 | — | TC-UI-RG-004 | TC-API-RG-001 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-01 User Registration | API-AC1-1: Register via POST /users/register | — | — | TC-UI-RG-001 | TC-API-RG-001 | Manual: N/A \| UI: Passed \| API: Passed |
| REQ-02 User Authentication | UI-AC1-2: User logs in with registered credentials | TC-M-002 | TC-UI-SM-002 | TC-UI-RG-003 | TC-API-SM-002 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-02 User Authentication | UI-AC1-4: Invalid login rejected with error | TC-M-007 | — | TC-UI-RG-004 | TC-API-RG-003 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-02 User Authentication | API-AC1-2: Login returns valid access_token | TC-M-002 | TC-UI-SM-002 | TC-UI-RG-003 | TC-API-SM-002 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-02 User Authentication | API-AC1-3: Bearer token works on protected endpoints | TC-M-002 | TC-UI-SM-002 | TC-UI-RG-003 | TC-API-SM-003 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-02 User Authentication | API-AC1-5: Missing/invalid token rejected | TC-M-007 | — | TC-UI-RG-004 | TC-API-RG-003 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-03 Profile Management | UI-AC1-3: Profile displays correct user information | TC-M-004 | — | TC-UI-RG-001 | — | Manual: Passed \| UI: Passed \| API: N/A |
| REQ-04 Session Management | User can logout and session ends | TC-M-006 | — | TC-UI-RG-003 | — | Manual: Passed \| UI: Passed \| API: N/A |
| REQ-05 Product Catalog | UI-AC2-1: User browses products | TC-M-001 | TC-UI-SM-001 | TC-UI-RG-002 | TC-API-SM-001 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-05 Product Catalog | API-AC2-1: Products retrieved via GET /products | TC-M-001 | TC-UI-SM-001 | TC-UI-RG-002 | TC-API-SM-001 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-06 Product Search & Filter | User can search and filter catalog | TC-M-005 | — | TC-UI-RG-002 | TC-API-RG-002 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-07 Cart Management | UI-AC2-2: User adds multiple items to cart | TC-M-005 | TC-UI-SM-003 | TC-UI-RG-002 | TC-API-RG-002 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-07 Cart Management | UI-AC2-3: User updates item quantity | TC-M-005 | — | TC-UI-RG-002 | TC-API-RG-002 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-07 Cart Management | API-AC1-4: Cart created with POST /carts | TC-M-003 | TC-UI-SM-003 | TC-UI-RG-002 | TC-API-SM-003 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-07 Cart Management | API-AC2-2: Products added to cart | TC-M-003 | TC-UI-SM-003 | TC-UI-RG-002 | TC-API-RG-002 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-07 Cart Management | API-AC2-3: Cart contents verified via GET /carts/{id} | TC-M-003 | TC-UI-SM-003 | TC-UI-RG-002 | TC-API-RG-002 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-08 Checkout | UI-AC2-4: Checkout completes with Cash on Delivery | TC-M-003 | TC-UI-SM-003 | TC-UI-RG-005 | TC-API-SM-003 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-08 Checkout | Checkout blocked for empty cart | TC-M-008 | — | TC-UI-RG-005 | — | Manual: Passed \| UI: Passed \| API: N/A |
| REQ-08 Checkout | Checkout blocked for invalid/missing billing | TC-M-008 | — | TC-UI-RG-005 | TC-API-RG-004 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-09 Invoice Generation | UI-AC2-5: Invoice requires two Confirm clicks | TC-M-003 | TC-UI-SM-003 | TC-UI-RG-005 | TC-API-SM-003 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-09 Invoice Generation | Invoice not created after single Confirm only | TC-M-008 | — | TC-UI-RG-005 | — | Manual: Passed \| UI: Passed \| API: N/A |
| REQ-09 Invoice Generation | API-AC2-4: Invoice generated via POST /invoices (COD) | TC-M-003 | TC-UI-SM-003 | TC-UI-RG-005 | TC-API-SM-003 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-09 Invoice Generation | API-AC2-5: Payload includes billing, cart_id, payment_method | TC-M-003 | TC-UI-SM-003 | TC-UI-RG-005 | TC-API-SM-003 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-09 Invoice Generation | API-AC2-6: Invalid invoice payload rejected | TC-M-008 | — | TC-UI-RG-005 | TC-API-RG-004 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-10 Invoice Visibility | UI-AC2-6: Invoice visible under My Invoices | TC-M-003 | TC-UI-SM-003 | TC-UI-RG-005 | TC-API-RG-005 | Manual: Passed \| UI: Passed \| API: Passed |
| REQ-10 Invoice Visibility | UI-AC2-7: Invoice details match order and billing | TC-M-003 | TC-UI-SM-003 | TC-UI-RG-005 | TC-API-RG-005 | Manual: Passed \| UI: Passed \| API: Passed |

---

## Coverage Summary

| Layer | Smoke | Regression | Total | Limit |
|-------|-------|------------|-------|-------|
| Manual | 3 (TC-M-001–003) | 5 (TC-M-004–008) | 8 | 5–8 ✓ |
| UI automation | 3 (TC-UI-SM-001–003) | 5 (TC-UI-RG-001–005) | 8 | 5–8 ✓ |
| API automation | 3 (TC-API-SM-001–003) | 5 (TC-API-RG-001–005) | 8 | 5–8 ✓ |

| Acceptance area | UI AC | API AC | Manual | UI auto | API auto |
|-----------------|-------|--------|--------|---------|----------|
| Registration & login | UI-AC1 | API-AC1 | ✓ | ✓ | ✓ |
| Purchase lifecycle | UI-AC2 | API-AC2 | ✓ | ✓ | ✓ |

---

## Automation Status Legend

| Status | Meaning |
|--------|---------|
| **Not Executed** | Manual test not yet run |
| **Planned** | Automation spec not yet implemented |
| **In Progress** | Automation under development |
| **Passed** | Executed successfully |
| **Failed** | Executed with failure |
| **N/A** | Not applicable for this layer |

---

*Automation statuses updated 03 August 2026 — see `reports/execution-summary.template.md`.*
