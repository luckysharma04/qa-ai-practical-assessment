# QA Risk Analysis — Practice Software Testing Toolshop

**Application:** Practice Software Testing — Toolshop v5.0 (Sprint 5)  
**UI:** https://practicesoftwaretesting.com/  
**API:** https://api.practicesoftwaretesting.com/api/documentation  
**Assessment scope:** Customer ecommerce lifecycle (register → purchase → invoice)  
**Document version:** 1.0  
**Related artifact:** `project-info.md`

---

## Risk Rating Scale

| Level | Likelihood (L) | Impact (I) | Priority |
|-------|----------------|------------|----------|
| **Critical** | High | High | P1 — Address before/during smoke |
| **High** | High/Medium | High/Medium | P1 — Must test and mitigate |
| **Medium** | Medium | Medium | P2 — Regression coverage |
| **Low** | Low | Low/Medium | P3 — Document or stretch |

**Risk Score:** Likelihood × Impact (qualitative: Critical > High > Medium > Low)

---

## Executive Summary

The Toolshop application is a **public, shared-environment** ecommerce SUT with intentional testing surface (including known API characteristics and UX quirks such as **double-confirm invoice**). Primary QA risks cluster around **shared data contamination**, **automation flakiness** (Cloudflare, dynamic IDs), **invoice/payment flow correctness**, and **scope/time constraints** of the assessment. Security risks exist by design on this practice platform and are documented separately from functional AC validation.

| Category | # Risks | Highest Priority |
|----------|---------|------------------|
| Business | 6 | P1 |
| Technical | 8 | P1 |
| API | 10 | P1 |
| UI | 9 | P1 |
| Security | 8 | P2 |
| Browser Compatibility | 5 | P2 |
| Performance | 5 | P2 |
| Payment | 6 | P1 |
| Invoice | 7 | P1 |

---

## 1. Business Risks

| Risk ID | Risk Description | Likelihood | Impact | Priority | Mitigation Strategy |
|---------|------------------|------------|--------|----------|---------------------|
| BR-01 | **Incomplete purchase lifecycle validation** — checkout or invoice failure blocks core business value (customer can complete an order) | Medium | High | **P1** | Prioritize UI AC2 and API AC2 E2E paths in smoke + regression; traceability to ACs |
| BR-02 | **Registration friction** — users cannot onboard, blocking all authenticated flows | Medium | High | **P1** | Cover UI/API AC1; negative registration cases; unique test emails |
| BR-03 | **Incorrect order/billing data on invoice** — customer receives wrong totals or billing details | Medium | High | **P1** | Assert cart totals vs invoice; verify billing fields in UI and API responses |
| BR-04 | **Catalog discovery failure** — customers cannot find products (search/filter broken) | Low | High | **P2** | Regression tests for search, category, brand, and sort filters |
| BR-05 | **Shared public database** — concurrent testers corrupt carts, users, or orders | High | Medium | **P1** | Timestamp/faker emails; API-driven setup; avoid hard-coded IDs |
| BR-06 | **Assessment scope vs business breadth** — over-testing peripheral features (messages, reports) delays core flow delivery | Medium | Medium | **P2** | Lock P1 features first; defer P3 to stretch; align to 5–8 cases per tier |

---

## 2. Technical Risks

| Risk ID | Risk Description | Likelihood | Impact | Priority | Mitigation Strategy |
|---------|------------------|------------|--------|----------|---------------------|
| TR-01 | **SUT availability** — public URLs down or rate-limited | Low | High | **P1** | Pre-run smoke health check; document dependency on external SUT |
| TR-02 | **Cloudflare / bot protection** blocks headless UI automation | Medium | High | **P1** | Retries, stable user-agent; headed mode if needed; API fallback for setup |
| TR-03 | **Dynamic IDs** (`cart_id`, `invoice_id`, `product_id`) break hard-coded tests | High | High | **P1** | Chain API calls; extract IDs from responses; no static cart IDs in specs |
| TR-04 | **Token/session expiry** mid long regression suite | Low | Medium | **P2** | Re-auth helper before protected calls; shorter smoke suite |
| TR-05 | **Playwright/Prism framework misconfiguration** — tests fail to run from README | Medium | High | **P1** | Validate README commands early; CI-style local run before submission |
| TR-06 | **AI-generated automation with wrong structure or assertions** | Medium | High | **P1** | Human review; run against live SUT; validate against Swagger |
| TR-07 | **Git / submission hygiene** — single commit loses iterative evidence | Medium | Medium | **P2** | Phase-based commits (requirements → manual → API → UI → reports) |
| TR-08 | **Node/npm environment drift** — local execution differs from documented setup | Low | Medium | **P2** | Pin dependencies; document Node version in README |

---

## 3. API Risks

| Risk ID | Risk Description | Likelihood | Impact | Priority | Mitigation Strategy |
|---------|------------------|------------|--------|----------|---------------------|
| AR-01 | **Invalid/missing bearer token** on protected endpoints returns unexpected status | Medium | High | **P1** | Negative tests: no token, malformed token; assert 401/403 |
| AR-02 | **Swagger contract drift** — live API differs from documentation | Low | High | **P2** | Spot-check responses vs OpenAPI; document discrepancies |
| AR-03 | **Registration/login payload validation gaps** — weak rules not documented in schema | Medium | Medium | **P2** | Explore error messages; negative payload tests |
| AR-04 | **Cart state inconsistency** — add/update/remove does not reflect on GET cart | Medium | High | **P1** | Verify cart after each mutation; API AC2 cart verification step |
| AR-05 | **Invoice POST with invalid `cart_id`** — wrong ID, empty cart, already invoiced cart | Medium | High | **P1** | Negative invoice tests; use dynamic valid cart before positive invoice |
| AR-06 | **Unauthenticated write endpoints** (e.g. some PUT without auth) — unintended data mutation | Medium | Low | **P3** | Document as known SUT behavior; separate security notes; not AC failure |
| AR-07 | **Invalid product ID behavior** — 500 vs 404 (e.g. `/products/{id}/related`) | Medium | Low | **P3** | Define expected behavior in test design; avoid flaky assumptions |
| AR-08 | **Search wildcard / SQL-like characters** in query params (`%`) | Low | Medium | **P3** | Edge-case API search test if in regression budget |
| AR-09 | **Admin vs customer response variance** — different data shapes per role | Low | Medium | **P3** | Use customer token for core ACs; admin only in stretch |
| AR-10 | **Rate limiting or throttling** on public API under parallel runs | Low | Medium | **P2** | Sequential API tests where needed; retry with backoff |

---

## 4. UI Risks

| Risk ID | Risk Description | Likelihood | Impact | Priority | Mitigation Strategy |
|---------|------------------|------------|--------|----------|---------------------|
| UR-01 | **Double-confirm invoice UX missed** — automation clicks Confirm once; invoice not created | High | High | **P1** | Explicit two-click step in page object; document in AC and test case |
| UR-02 | **Fragile locators** on filters, sort, and dynamic product grid | High | Medium | **P1** | Page objects; role/text locators; wait for network idle where needed |
| UR-03 | **Login/register form validation** not surfaced clearly in UI | Medium | Medium | **P2** | Manual + UI negative cases; assert error messages |
| UR-04 | **Cart UI out of sync with API** — displayed quantity/total wrong | Medium | High | **P1** | Cross-check UI cart with API GET after mutations |
| UR-05 | **Checkout billing form** — required fields unclear or validation inconsistent | Medium | High | **P1** | Negative checkout tests; map fields to API invoice payload |
| UR-06 | **Empty cart checkout** — user reaches checkout without items | Medium | Medium | **P2** | Regression case: empty cart blocked or error shown |
| UR-07 | **My Invoices** — new invoice not listed or detail page stale | Medium | High | **P1** | Post-invoice navigation assert; wait for list refresh |
| UR-08 | **Guest vs authenticated cart behavior** confusion | Medium | Medium | **P2** | Test logged-in path for AC2; document guest limitations |
| UR-09 | **Unicode/special characters** in billing or profile break UI rendering | Low | Medium | **P3** | Optional edge case if regression budget allows |

---

## 5. Security Risks

| Risk ID | Risk Description | Likelihood | Impact | Priority | Mitigation Strategy |
|---------|------------------|------------|--------|----------|---------------------|
| SR-01 | **Bearer token exposure** in logs, reports, or git history | Low | High | **P1** | Mask tokens in logs; never commit `.env`; sanitize prompt history |
| SR-02 | **Password or credentials in AI prompts** | Low | High | **P1** | Use only public SUT defaults; synthetic users; ai-prompts hygiene |
| SR-03 | **IDOR / unauthorized access** — user A accesses user B cart or invoice | Medium | High | **P2** | API test with mismatched token and resource ID (stretch) |
| SR-04 | **Unauthenticated data modification** on API (by SUT design) | High | Medium | **P2** | Document; optional trickster tests; not blocking functional AC |
| SR-05 | **Email enumeration** — register/login reveals existing emails | Medium | Low | **P3** | Note in risk register; out of core functional scope |
| SR-06 | **Admin endpoints accessible with customer token** | Low | High | **P2** | Verify customer cannot DELETE or access admin-only routes |
| SR-07 | **Shared DB — PII from other testers** visible in test data | Medium | Medium | **P2** | Do not use real PII; avoid asserting on unrelated user data |
| SR-08 | **HTTPS/TLS** — mixed content or insecure calls | Low | High | **P2** | Assert base URLs use HTTPS; no credential over HTTP |

*Note: Full penetration testing is **out of scope** for this assessment; risks above are QA-observable baseline checks.*

---

## 6. Browser Compatibility Risks

| Risk ID | Risk Description | Likelihood | Impact | Priority | Mitigation Strategy |
|---------|------------------|------------|--------|----------|---------------------|
| BC-01 | **Chromium-only automation** — defects only in Firefox/Safari | Medium | Medium | **P2** | Document Chromium as default; optional manual spot-check on Chrome |
| BC-02 | **Headless vs headed divergence** — Cloudflare or JS behaves differently | Medium | High | **P1** | Run smoke headed if headless fails; configure Playwright accordingly |
| BC-03 | **Cookie/session handling** differs across browsers | Low | Medium | **P3** | Stick to single browser for automation; manual cross-browser if time |
| BC-04 | **Viewport/responsive layout** — checkout or cart broken on narrow width | Low | Medium | **P3** | Out of core scope unless manual check added |
| BC-05 | **Browser version drift** — Playwright bundled browser vs user Chrome | Low | Low | **P3** | Use Playwright-managed Chromium for consistency |

---

## 7. Performance Risks

| Risk ID | Risk Description | Likelihood | Impact | Priority | Mitigation Strategy |
|---------|------------------|------------|--------|----------|---------------------|
| PR-01 | **Slow product listing/search** under public load | Medium | Medium | **P2** | Subjective sanity during manual run; not load-test scope |
| PR-02 | **UI automation timeout** on catalog or checkout | Medium | High | **P1** | Tune Playwright timeouts; explicit waits; avoid fixed sleeps |
| PR-03 | **API latency spikes** cause flaky chained tests | Medium | Medium | **P2** | Retry policy for GET; single retry on invoice POST only if idempotent concern documented |
| PR-04 | **Large regression suite** exceeds assessment time box | High | Medium | **P1** | Cap at 5–8 cases per tier; smoke &lt; 30 min |
| PR-05 | **Parallel test execution** against shared DB increases collisions | High | Medium | **P2** | Run workers=1 for UI/API if flakiness observed |

*Formal load/stress testing is **out of scope**.*

---

## 8. Payment Risks

| Risk ID | Risk Description | Likelihood | Impact | Priority | Mitigation Strategy |
|---------|------------------|------------|--------|----------|---------------------|
| PM-01 | **COD-only scope** — other payment methods untested | High | Low | **P2** | Explicit in-scope: `cash-on-delivery`; document out-of-scope methods |
| PM-02 | **Wrong `payment_method` in API payload** — invoice rejected | Medium | High | **P1** | Assert `payment_method: cash-on-delivery` in API tests |
| PM-03 | **UI payment selection mismatch** — COD not selected but checkout proceeds | Medium | High | **P1** | UI test selects COD explicitly before confirm |
| PM-04 | **Invalid `payment_details`** structure for COD | Low | Medium | **P2** | Use `{}` as per assessment example; negative test with wrong structure |
| PM-05 | **Checkout without payment method** | Medium | Medium | **P2** | Negative UI/API case if validation exists |
| PM-06 | **Order marked paid/delivered incorrectly** for COD workflow | Low | High | **P2** | Verify invoice status fields in API/UI if exposed |

---

## 9. Invoice Risks

| Risk ID | Risk Description | Likelihood | Impact | Priority | Mitigation Strategy |
|---------|------------------|------------|--------|----------|---------------------|
| IR-01 | **Single Confirm click** — invoice not generated (UI) | High | High | **P1** | Two explicit Confirm actions; screenshot evidence in execution report |
| IR-02 | **Invoice POST fails** — billing field missing or invalid | Medium | High | **P1** | Positive payload per AC example; negative missing-field tests |
| IR-03 | **Invoice for empty or wrong `cart_id`** | Medium | High | **P1** | Chain cart creation before invoice; negative bad `cart_id` test |
| IR-04 | **Duplicate invoice** for same cart | Medium | Medium | **P2** | Optional: second POST same cart — document actual behavior |
| IR-05 | **My Invoices list missing new invoice** | Medium | High | **P1** | Navigate to My Invoices after generation; assert invoice ID or line items |
| IR-06 | **Invoice totals ≠ cart totals** | Medium | High | **P1** | Compare product lines, quantities, and amounts UI vs API |
| IR-07 | **Billing address on invoice ≠ checkout form** | Medium | High | **P1** | Use known billing data; assert on invoice detail view |

---

## 10. Consolidated Mitigation Strategy

### 10.1 Test Design Mitigations

| Strategy | Applies To | Action |
|----------|------------|--------|
| **AC-first coverage** | Business, UI, API, Invoice, Payment | Map every P1 test to UI-AC1/AC2 or API-AC1/AC2 |
| **Dynamic data chaining** | Technical, API, Invoice | Register → login → cart → add items → invoice; extract IDs at runtime |
| **Unique test users** | Business, Technical | `testuser_<timestamp>@example.com` for registration flows |
| **Smoke before regression** | Technical, Performance | `@Smoke` gate before full `@Regression` |
| **API setup for UI** | UI, Technical | Create cart via API when UI login is slow or flaky |
| **Double-confirm pattern** | UI, Invoice | Dedicated page object method `confirmInvoiceTwice()` |
| **Negative suite** | API, UI, Payment, Invoice | Token, payload, empty cart, invalid billing |
| **Human review of AI output** | Technical | Validate scripts against Swagger and live execution |

### 10.2 Environment & Execution Mitigations

| Strategy | Action |
|----------|--------|
| **Stable browser** | Playwright Chromium; document version in README |
| **Retry policy** | Limited retries on UI navigation only; avoid on non-idempotent POST |
| **Sequential workers** | `workers: 1` if shared DB collisions occur |
| **Execution evidence** | HTML report, screenshots on failure, API response logs (tokens masked) |
| **Iterative git** | Commit per phase: docs → manual → API → UI → reports |

### 10.3 Documentation Mitigations

| Strategy | Action |
|----------|--------|
| **Risk register** | This document + summary in `project-info.md` |
| **Known behaviors** | Double-confirm, shared DB, COD-only — documented as expected |
| **Out-of-scope security** | Full pentest excluded; baseline checks listed in SR-* |

---

## 11. Priority Matrix (Top Risks)

| Rank | Risk ID | Category | Description | L | I | Priority |
|------|---------|----------|-------------|---|---|----------|
| 1 | UR-01 | UI | Double-confirm invoice missed | High | High | **P1** |
| 2 | IR-01 | Invoice | Single confirm — no invoice | High | High | **P1** |
| 3 | TR-03 | Technical | Hard-coded dynamic IDs | High | High | **P1** |
| 4 | BR-05 | Business | Shared DB data contamination | High | Medium | **P1** |
| 5 | TR-02 | Technical | Cloudflare blocks automation | Medium | High | **P1** |
| 6 | AR-04 | API | Cart state inconsistency | Medium | High | **P1** |
| 7 | IR-03 | Invoice | Invoice with invalid cart | Medium | High | **P1** |
| 8 | PM-02 | Payment | Wrong payment_method | Medium | High | **P1** |
| 9 | BR-01 | Business | Incomplete purchase lifecycle | Medium | High | **P1** |
| 10 | TR-06 | Technical | Unreviewed AI automation | Medium | High | **P1** |

---

## 12. Risk Coverage Map (Tests)

| Risk ID | Suggested Test Layer | Tag |
|---------|------------------------|-----|
| UR-01, IR-01 | UI E2E invoice flow | `@Smoke`, `@Regression` |
| TR-03, AR-04, IR-03 | API cart + invoice chain | `@Smoke`, `@Regression` |
| BR-05 | API registration with unique email | `@Regression` |
| AR-01 | API negative — no/invalid token | `@Regression` |
| UR-05, IR-02 | UI/API billing validation negatives | `@Regression` |
| PM-02 | API invoice POST COD payload | `@Smoke` |
| UR-04, IR-06 | UI cart + invoice total check | `@Regression` |
| BR-02 | UI/API AC1 register + login | `@Regression` |

---

## 13. Sign-off Checklist

| Item | Status |
|------|--------|
| P1 risks have mapped test cases | ☐ |
| Mitigations documented in automation design | ☐ |
| Double-confirm invoice covered in UI tests | ☐ |
| Dynamic `cart_id` — no hard-coded invoice payloads | ☐ |
| Smoke suite runnable from README | ☐ |
| Tokens/credentials not in repo or prompts | ☐ |
| Risk summary referenced in `project-info.md` | ☐ |

---

*End of QA Risk Analysis*
