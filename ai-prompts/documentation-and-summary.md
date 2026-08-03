# AI Prompts — Documentation and Summary

Record of Cursor AI prompts for README, reports documentation, and project-info deliverables.

**Date:** 03 August 2026

---

## Entry 1 — Initial README scaffold

### Prompt

Generate the complete project folder structure exactly as expected in this assessment. Include `FunctionalTestCase`, `PrismStructure`, `project-info.md`, **README.md**, `ai-prompts`, `reports`, `screenshots`, `test-data`, `package.json`. Explain each folder.

### AI Response Summary

Created root `README.md` with prerequisites, setup (`npm install`, Playwright Chromium), basic test commands (`test:smoke`, `test:regression`, UI/API variants), manual test pointers, reports table, assessment compliance checklist, and link to `PROJECT-STRUCTURE.md`. Root `package.json` delegates scripts to `PrismStructure/` via `--prefix`.

### Edits made after AI suggestions

| Edit | Detail |
|------|--------|
| FunctionalTestCase path | Corrected to `FunctionalTestCase/FunctionalTestCase.csv` (not root-level CSV) |
| Automation counts | Updated from “planned” to actual spec counts as suites were built |
| `postinstall` behavior | Documented that root `npm install` also installs `PrismStructure` dependencies |

### Reason for edits

- Assessment folder naming requires manual cases inside `FunctionalTestCase/`.
- README must reflect **delivered** automation, not placeholders, for evaluator trust.
- Evaluators run `npm install` from root only — postinstall must be explicit to avoid “module not found” errors.

---

## Entry 2 — Full README generation (assessment deliverable)

### Prompt

Generate README.md.

Include:

- Project Overview
- Framework
- Installation (`npm install`)
- How to run Smoke
- How to run Regression
- How to run API
- Folder Structure
- Reports
- Troubleshooting
- Future Improvements

### AI Response Summary

Rewrote root `README.md` as evaluator-facing runbook (~330 lines):

- **Project Overview** — manual 8 + UI 12 + API 8 specs, tags, default user, scope
- **Framework** — PrismStructure layers table (Pages, API services, fixtures, assertions, schemas)
- **Installation** — Node 18+, clone, `npm install`, `npx playwright install chromium`, root-level commands
- **Smoke / Regression / API** — npm scripts with **test ID tables** (TC-UI-SM-*, TC-API-RG-*, etc.)
- **Folder Structure** — annotated tree including `API/schemas/`, `Reports/`, `scripts/copy-reports.js`
- **Reports** — HTML, JSON, JUnit, failure logs, screenshots, video, trace; `npm run report` / `report:copy`
- **Troubleshooting** — nine common failure modes from live debugging
- **Future Improvements** — CI, cross-browser, Allure, accessibility, performance
- **Additional Resources** — links to `project-info.md`, RTM, test plan, ai-prompts

### Edits made after AI suggestions

| Area | AI first draft | Edit applied | Why required |
|------|----------------|--------------|--------------|
| **Smoke test count** | Generic “smoke health checks” | Explicit counts: all smoke **10** (7 UI + 3 API) | Matches `playwright test --list` after tag projects |
| **UI automation count** | RTM draft said 8 UI specs | Documented **12** UI specs (7 smoke + 5 regression) | Implementation split smoke flows (login, cart, checkout, invoice separate) for debugability |
| **API E2E flow** | Swagger-style `/carts/{id}/items` | Documented `POST /carts/{cartId}` + cart delete cleanup | Live API returned 404 on `/items` — README must not mislead |
| **Tags** | `@Smoke` / `@Regression` only | Added `@UI` / `@API` and project scripts (`test:ui:smoke`, etc.) | Tag matrix added after README first draft |
| **Reports section** | HTML + JSON only | Added JUnit, failure logs, video/trace, `report:copy` | Reporting configured in separate session; submission needs full artifact list |
| **Troubleshooting** | Not in early README | Added section from **actual** debug outcomes | Evaluators hit same SUT quirks (cart route, double confirm, password rules) |
| **Assessment compliance table** | Separate long section in old README | Moved detail to linked docs; kept README focused on **how to run** | Assessment requires runnable README; deep compliance lives in `project-info.md` / RTM |
| **Clone URL** | Placeholder `<your-repo-url>` | Kept placeholder — **human must fill** before public git push | AI cannot know final repository URL |
| **Troubleshooting: billing** | Not mentioned initially | Note profile may pre-fill checkout address | Discovered during assertion hardening — reduces false “README is wrong” reports |

### Reason for edits (summary)

1. **Correctness** — Commands and counts must match `package.json` and Playwright projects after implementation evolved beyond initial RTM draft.
2. **Live SUT fidelity** — Troubleshooting documents real Toolshop behaviors AI did not predict (double confirm, `/cart` vs `/checkout`, API cart endpoint).
3. **Submission readiness** — Reports and `report:copy` workflow required for assessment execution evidence.
4. **Evaluator experience** — Root-level npm commands, test ID tables, and prerequisite browser install reduce setup friction.
5. **Human judgment** — Removed stale “planned” language; added caveats where automation differs from ideal REST assumptions.

---

## Entry 3 — README updates after reporting configuration

### Prompt

Configure HTML Report, JSON Report, JUnit Report, Screenshots, Videos, Trace, Failure Logs. Explain how to run reports.

### AI Response Summary

Updated `playwright.config.js` with full reporter stack and artifact retention on failure. Added `npm run report:copy` and `reports/README.md`.

### Edits made to README after AI suggestions

| Addition | Content |
|----------|---------|
| Reports table | JUnit path, `failure-logs/`, video/trace locations |
| View reports subsection | `npm run report` + `npm run report:copy` |
| Submission workflow | test → report → copy → `execution-summary.template.md` |
| Troubleshooting | “Reports not updating” — run copy after latest test |

### Reason for edits

- Assessment exit criteria include execution evidence — README must document **all** generated artifacts, not only HTML.
- Evaluators may look in repo `reports/` folder — `report:copy` step must be explicit.
- Without “reports overwritten each run” note, users open stale HTML and misdiagnose failures.

---

## Entry 4 — README cross-links after `project-info.md`

### Prompt

Generate `project-info.md` with every assessment section (AI Usage, Requirement Analysis, Test Planning, Automation Strategy, Test Data, Validation, Debugging, Sensitive Information, Reuse Strategy).

### AI Response Summary

Full `project-info.md` (649 lines) generated as core assessment document.

### Edits made to README after AI suggestions

| Edit | Reason |
|------|--------|
| **Additional Resources** table links `project-info.md`, `test-suite-scope.md`, `ai-prompts/` | README stays operational; deep AI workflow and AC detail live in project-info |
| Removed duplicate requirement analysis from README | Avoid maintaining two sources of truth |
| Framework section points to `FRAMEWORK.md` and `PROJECT-STRUCTURE.md` | Technical depth in subsystem docs |

### Reason for edits

- Assessment requires both **README (how to run)** and **project-info (how AI was used)** — separation prevents an unreadable single file.
- Cross-links help evaluators navigate without repeating 600+ lines in README.

---

## README generation timeline

| Phase | README state |
|-------|----------------|
| Project scaffold | Basic setup + commands + compliance table |
| UI/API automation complete | Updated counts; manual path fix |
| Tags + Playwright projects | Layer/tier npm scripts documented |
| Reporting configured | Full artifact table + `report:copy` |
| Final user prompt | Full restructure with Framework, Troubleshooting, Future Improvements |
| project-info delivered | Additional Resources links; scope detail deferred |

---

## Current README structure (final)

1. Title + SUT URL table  
2. Project Overview  
3. Framework  
4. Installation  
5. How to Run Smoke (with ID tables)  
6. How to Run Regression (with ID tables)  
7. How to Run API  
8. Folder Structure  
9. Reports  
10. Troubleshooting  
11. Future Improvements  
12. Additional Resources  
13. License  

**Primary audience:** Assessment evaluators and future maintainers running tests from repository root.

**Verified commands:**

```bash
npm install
npm run test:smoke
npm run test:regression
npm run test:api
npm run report
npm run report:copy
```

---

## Related documentation (same session)

| File | Relationship to README |
|------|----------------------|
| `project-info.md` | AI workflow, ACs, validation — linked from README |
| `reports/README.md` | Copy instructions — summarized in README Reports section |
| `test-data/README.md` | Data files — README points to `test-data/` in folder tree |
| `PrismStructure/FRAMEWORK.md` | Framework depth — linked from README Framework section |
| `PROJECT-STRUCTURE.md` | Full tree explanations — linked from README |

---

## Lessons learned (documentation)

| Lesson | Application |
|--------|-------------|
| README must be validated against **working** npm scripts | Ran `npm run test:api:smoke` and `report:copy` while writing docs |
| Troubleshooting belongs in README when SUT is public and quirky | Saves evaluator time; proves debugging was real |
| Keep counts and IDs synchronized with RTM | README tables match `RTM.md` automation ID reference |
| Do not document wrong API endpoints | AI/swagger guesses corrected after live probes |
| Separate “run book” from “process narrative” | README + project-info division matches assessment intent |

---

*Complement: `ai-prompts/requirements-and-planning.md` (planning phase), `ai-prompts/test-design.md`, `ai-prompts/test-data.md`, `ai-prompts/automation-and-debugging.md`.*
