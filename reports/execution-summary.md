# Test Execution Summary

**Date:** 03 August 2026  
**Environment:** https://practicesoftwaretesting.com / https://api.practicesoftwaretesting.com  
**Executed by:** Lucky Sharma

## Manual Tests (`FunctionalTestCase/FunctionalTestCase.csv`)

| Tier | Total | Passed | Failed | Not Run |
|------|-------|--------|--------|---------|
| Smoke | 3 | 3 | 0 | 0 |
| Regression | 5 | 5 | 0 | 0 |

## UI Automation (`PrismStructure/Tests/ui`)

| Tier | Total | Passed | Failed |
|------|-------|--------|--------|
| @Smoke | 7 | 7 | 0 |
| @Regression | 5 | 5 | 0 |

**UI smoke specs:** TC-UI-SM-LOGIN, TC-UI-SM-CART, TC-UI-SM-CHECKOUT, TC-UI-SM-INVOICE, TC-UI-SM-LOGOUT, TC-UI-SM-REG, TC-UI-SM-SEARCH — all passed on final run (`npm run test:smoke`, ~4.1 min).

## API Automation (`PrismStructure/API/tests`)

| Tier | Total | Passed | Failed |
|------|-------|--------|--------|
| @Smoke | 3 | 3 | 0 |
| @Regression | 5 | 5 | 0 |

## Automation run commands

| Command | Result | Duration (approx.) |
|---------|--------|------------------|
| `npm run test:smoke` | 10/10 passed (7 UI + 3 API) | ~4.1 min |
| `npm run test:regression` | 10/10 passed (5 UI + 5 API) | ~2.6 min |

## Totals

| Layer | Total | Passed | Failed |
|-------|-------|--------|--------|
| Manual | 8 | 8 | 0 |
| UI automation | 12 | 12 | 0 |
| API automation | 8 | 8 | 0 |
| **All tiers** | **28** | **28** | **0** |

## Evidence

- HTML report: `reports/playwright-report/` (copied via `npm run report:copy` after final smoke run)
- Playwright JSON: `reports/test-results.json` (10 tests, 0 failures — smoke suite)
- JUnit XML: `reports/junit-results.xml` (10 tests, 0 failures)
- Failure logs: `reports/failure-logs/` (empty — no failures on final smoke run)
- Screenshots / video / trace: available in HTML report on failure (none on final green runs)

## Notes

- Manual suite: all 8 cases marked **Passed** in `FunctionalTestCase.csv`.
- Final smoke run: **10/10 passed** (UI checkout, invoice, and search fixes applied for profile billing and SUT navigation retries).
- Regression run: **10/10 passed** (5 UI + 5 API).
- RTM automation statuses: **Passed** in `RTM.md` and `RTM.csv`.
- Copied `reports/` artifacts reflect the **latest smoke execution**; regression passed in a separate run the same day.
