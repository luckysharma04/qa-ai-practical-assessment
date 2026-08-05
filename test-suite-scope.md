# Test Suite Scope — Assessment Compliance

Per QA Practical Assessment: **5–8 test cases per type** (Manual, UI, API), including `@Smoke` and `@Regression`.

---

## Manual (`FunctionalTestCase.csv`)

| Count | Limit | Status    |
| ----- | ----- | --------- |
| **8** | 5–8   | Compliant |

| Test ID  | Smoke/Regression | Type     | Coverage                                               |
| -------- | ---------------- | -------- | ------------------------------------------------------ |
| TC-M-001 | Smoke            | Positive | Catalog load                                           |
| TC-M-002 | Smoke            | Positive | Login                                                  |
| TC-M-003 | Smoke            | Positive | E2E purchase, COD, double-confirm invoice, My Invoices |
| TC-M-004 | Regression       | Positive | Registration + profile (UI-AC1)                        |
| TC-M-005 | Regression       | Positive | Search, filter, multi-cart, quantity (UI-AC2)          |
| TC-M-006 | Regression       | Positive | Login + logout                                         |
| TC-M-007 | Regression       | Negative | Invalid login, duplicate registration                  |
| TC-M-008 | Regression       | Negative | Empty cart, invalid billing, single-confirm invoice    |

**Split:** 3 Smoke + 5 Regression = 8 total.

---

## UI automation (Playwright)

| Count | Limit | Status    |
| ----- | ----- | --------- |
| **8** | 5–8   | Compliant |

| Test ID | Tier | Spec file | Maps to manual | Coverage |
| ------- | ---- | --------- | -------------- | -------- |
| TC-UI-SM-001 | @Smoke | `Tests/ui/smoke/catalog.spec.js` | TC-M-001 | Catalog load + product search |
| TC-UI-SM-002 | @Smoke | `Tests/ui/smoke/login.spec.js` | TC-M-002 | Login with valid credentials |
| TC-UI-SM-003 | @Smoke | `Tests/ui/smoke/e2e-purchase.spec.js` | TC-M-003 | Cart → COD checkout → double-confirm invoice → My Invoices |
| TC-UI-RG-001 | @Regression | `Tests/ui/regression/registration-profile.spec.js` | TC-M-004 | Registration + profile |
| TC-UI-RG-002 | @Regression | `Tests/ui/regression/catalog-cart.spec.js` | TC-M-005 | Search, filter, multi-cart, quantity |
| TC-UI-RG-003 | @Regression | `Tests/ui/regression/session.spec.js` | TC-M-006 | Login session + logout |
| TC-UI-RG-004 | @Regression | `Tests/ui/regression/auth-negative.spec.js` | TC-M-007 | Invalid login + duplicate registration |
| TC-UI-RG-005 | @Regression | `Tests/ui/regression/checkout-negative.spec.js` | TC-M-008 | Empty cart, invalid billing, single confirm |

**Split:** 3 Smoke + 5 Regression = 8 total.

---

## API automation (Playwright)

| Count | Limit | Status    |
| ----- | ----- | --------- |
| **8** | 5–8   | Compliant |

| Tier       | Count | Tag           |
| ---------- | ----- | ------------- |
| Smoke      | 3     | `@Smoke`      |
| Regression | 5     | `@Regression` |
| **Total**  | **8** |               |

Coverage: login/token, create cart, GET products, invoice POST chain (smoke); register, cart mutations, token/payload negatives (regression).

---

## Summary

| Type | Smoke | Regression | Total | Limit | Status |
| ---- | ----- | ---------- | ----- | ----- | ------ |
| Manual | 3 | 5 | 8 | 5–8 | Compliant |
| UI automation | 3 | 5 | **8** | 5–8 | Compliant |
| API automation | 3 | 5 | 8 | 5–8 | Compliant |

---

*Manual cases TC-M-001–008 map 1:1 to UI specs TC-UI-SM/RG-* and API specs TC-API-SM/RG-* via `RTM.md`.*
