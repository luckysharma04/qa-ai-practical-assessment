# Test Execution Summary

**Date:** 03 August 2026  
**Environment:** https://practicesoftwaretesting.com / https://api.practicesoftwaretesting.com  
**Executed by:** Lucky Sharma

## Manual Tests (`FunctionalTestCase/FunctionalTestCase.csv`)

| Tier | Total | Passed | Failed | Not Run |
|------|-------|--------|--------|---------|
| Smoke | 3 | 3 | 0 | 0 |
| Regression | 5 | 5 | 0 | 0 |

### Manual evidence (`screenshots/`)

| Test ID | Scenario | Screenshot |
|---------|----------|------------|
| TC-M-001 | Catalog load | `screenshots/TC-M-001-home.png` |
| TC-M-002 | Login | `screenshots/TC-M-002-login.png` |
| TC-M-003 | E2E purchase + double-confirm + My Invoices | `screenshots/TC-M-003-double-confirm.png`, `screenshots/TC-M-003-my-invoices.png`, `screenshots/TC-M-003-invoice-details.png` |

## UI Automation (`PrismStructure/Tests/ui`)

| Tier | Total | Passed | Failed |
|------|-------|--------|--------|
| @Smoke | 7 | 7 | 0 |
| @Regression | 5 | 5 | 0 |

**UI smoke specs:** TC-UI-SM-LOGIN, TC-UI-SM-CART, TC-UI-SM-CHECKOUT, TC-UI-SM-INVOICE, TC-UI-SM-LOGOUT, TC-UI-SM-REG, TC-UI-SM-SEARCH — all passed (`npm run test:smoke`, ~4.1 min).

## API Automation (`PrismStructure/API/tests`)

| Tier | Total | Passed | Failed |
|------|-------|--------|--------|
| @Smoke | 3 | 3 | 0 |
| @Regression | 5 | 5 | 0 |

## Automation run commands

| Command | Result | Duration (approx.) |
|---------|--------|------------------|
| `npm run test:smoke` | 10/10 passed (7 UI + 3 API) | ~4.1 min |
| `npm run test:regression` | 10/10 passed (5 UI + 5 API) | ~3.7 min |

## Totals

| Layer | Total | Passed | Failed |
|-------|-------|--------|--------|
| Manual | 8 | 8 | 0 |
| UI automation | 12 | 12 | 0 |
| API automation | 8 | 8 | 0 |
| **All tiers** | **28** | **28** | **0** |

## Evidence

- **Manual screenshots:** `screenshots/` (TC-M-001 home, TC-M-002 login, TC-M-003 checkout confirm + My Invoices + invoice detail)
- **HTML report:** `reports/playwright-report/` (copied via `npm run report:copy` — latest copy: regression suite)
- **Playwright JSON:** `reports/test-results.json` (10 tests, 0 failures)
- **JUnit XML:** `reports/junit-results.xml` (10 tests, 0 failures)
- **Failure logs:** `reports/failure-logs/` (empty on final green runs)

## Notes

- Manual suite: all 8 cases marked **Passed** in `FunctionalTestCase.csv`; key smoke flows backed by screenshots above.
- Smoke automation: **10/10 passed**.
- Regression automation: **10/10 passed**.
- RTM automation statuses: **Passed** in `RTM.md` and `RTM.csv`.
