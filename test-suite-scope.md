# Test Suite Scope — Assessment Compliance

Per QA Practical Assessment: **5–8 test cases per type** (Manual, UI, API), including `@Smoke` and `@Regression`.

## Manual (`FunctionalTestCase/FunctionalTestCase.csv`)


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

## UI automation (Playwright)


| Tier       | Target count | Tag           |
| ---------- | ------------ | ------------- |
| Smoke      | 3–4          | `@Smoke`      |
| Regression | 4–5          | `@Regression` |
| **Total**  | **5–8**      |               |


Mapping: mirror TC-M-001–003 (smoke) + TC-M-004–008 (regression) as automated UI specs.

## API automation (Playwright)


| Tier       | Target count | Tag           |
| ---------- | ------------ | ------------- |
| Smoke      | 3–4          | `@Smoke`      |
| Regression | 4–5          | `@Regression` |
| **Total**  | **5–8**      |               |


Coverage: login/token, create cart, GET products, invoice POST chain (smoke); register, cart mutations, token/payload negatives (regression).

---

*Previous expanded drafts (TC-SM, TC-RG, TC-ED, TC-NG series) were consolidated into TC-M-001–008 to meet the assessment case limit.*