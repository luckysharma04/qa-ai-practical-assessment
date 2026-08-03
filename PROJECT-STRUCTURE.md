# Project Structure — QA AI Practical Assessment

Complete repository layout aligned with the **QA AI Capability Exercise** submission requirements.

---

## Root Tree

```
qa-ai-practical-assessment/
│
├── FunctionalTestCase/                 # Manual functional test suite
│   └── FunctionalTestCase.csv
│
├── PrismStructure/                     # Playwright + Prism (UI + API + runtime reports)
│   ├── Pages/                          # UI Page Objects
│   ├── Tests/                          # UI test specs
│   │   └── ui/
│   │       ├── smoke/
│   │       └── regression/
│   ├── API/                            # API clients, services, tests
│   │   ├── clients/
│   │   ├── services/
│   │   └── tests/
│   │       ├── smoke/
│   │       └── regression/
│   ├── Fixtures/                       # Playwright custom fixtures
│   ├── Utils/                          # Automation helpers
│   ├── Data/                           # Automation test data modules
│   ├── Config/                         # env + constants
│   ├── Reports/                        # Playwright-generated output
│   ├── playwright.config.js
│   ├── package.json
│   └── FRAMEWORK.md
│
├── project-info.md                     # Project summary + requirement analysis + AI workflow
├── README.md                           # Setup and execution instructions
├── package.json                        # Root npm scripts (delegates to PrismStructure)
│
├── test-data/                          # Shared JSON fixtures (manual + automation)
│   ├── users.json
│   ├── billing.json
│   └── invoice-payload.example.json
│
├── reports/                            # Submission execution evidence
│   ├── execution-summary.template.md
│   └── playwright-report/              # Copy after test run
│
├── screenshots/                        # Manual test / failure screenshots
│
├── ai-prompts/                         # Cursor AI prompt history
│   ├── requirements-and-planning.md
│   ├── test-design.md
│   ├── test-data.md
│   ├── automation-and-debugging.md
│   └── documentation-and-summary.md
│
├── test-plan.md                        # Test plan (supporting artifact)
├── qa-risk-analysis.md                 # Risk analysis (supporting artifact)
├── RTM.md                              # Requirements traceability matrix
├── RTM.csv
└── test-suite-scope.md                 # Case count compliance
```

---

## Folder Explanations

### `FunctionalTestCase/`

**Purpose:** **Manual functional testing** deliverable required by the assessment.

| Item | Description |
|------|-------------|
| `FunctionalTestCase.csv` | Manual test cases with steps, expected results, Smoke/Regression, Positive/Negative/Edge, execution Status |

**Why separate folder:** Keeps manual artifacts distinct from automation; matches assessment naming `FunctionalTestCase (.csv)`.

**Compliance:** 8 cases total (3 Smoke + 5 Regression) within the 5–8 manual limit.

---

### `PrismStructure/`

**Purpose:** **Playwright automation framework** for UI and API — the assessment’s `PrismStructure (Playwright … API+UI+ Execution Report)` folder.

| Subfolder | Role |
|-----------|------|
| `Pages/` | Page Object Model — locators and UI actions per screen |
| `Tests/` | UI spec files tagged `@Smoke` / `@Regression` |
| `API/` | HTTP clients, resource services, API spec files |
| `Fixtures/` | Injects page objects and API clients into tests |
| `Utils/` | Faker, logging, shared helpers |
| `Data/` | JS modules for automation runtime data |
| `Config/` | Base URLs, routes, tags |
| `Reports/` | **Generated** Playwright HTML/JSON/traces (working directory) |

**Detail:** See `PrismStructure/FRAMEWORK.md`.

---

### `project-info.md`

**Purpose:** **Core assessment document** — project summary, tools, setup summary (10 AI workflow points), requirement analysis, scope, ACs, smoke/regression scope.

**Audience:** Evaluators reviewing AI-assisted QA process and requirement understanding.

---

### `README.md`

**Purpose:** **How to run the project** — prerequisites, install, test commands, report locations, test data pointers.

**Required by assessment:** Runnable automation from README with smoke/regression commands.

---

### `package.json` (root)

**Purpose:** **Orchestration** at repository root so evaluators run `npm install` and `npm run test:smoke` from the project root without navigating into `PrismStructure/`.

Delegates to `PrismStructure/package.json` via `--prefix PrismStructure`.

---

### `test-data/`

**Purpose:** **Shared test data** in JSON form for manual testers and automation authors.

| File | Content |
|------|---------|
| `users.json` | Public SUT default accounts |
| `billing.json` | Valid billing for UI forms and API |
| `invoice-payload.example.json` | Assessment invoice POST reference |

**vs `PrismStructure/Data/`:** Root `test-data/` is human-readable JSON for the whole project; `PrismStructure/Data/` is JavaScript modules imported by automation code.

---

### `reports/`

**Purpose:** **Submission execution evidence** — consolidated reports for evaluators.

| Content | Source |
|---------|--------|
| `execution-summary.template.md` | Manual summary of pass/fail counts |
| `playwright-report/` | Copy from `PrismStructure/Reports/playwright-report/` after run |
| `test-results.json` | Copy from `PrismStructure/Reports/test-results.json` |

**Assessment requirement:** Execution reports with all test cases **Passed**.

---

### `screenshots/`

**Purpose:** **Visual evidence** — manual test screenshots, critical flow captures (invoice double-confirm, My Invoices), optional failure screenshots from Playwright.

**Naming suggestion:** `TC-M-003-invoice-confirm.png`, `TC-UI-SM-003-checkout.png`

---

### `ai-prompts/`

**Purpose:** **AI prompt history** — demonstrates thoughtful Cursor AI use (required by assessment).

| File | Phase |
|------|-------|
| `requirements-and-planning.md` | Requirements, risks, test plan |
| `test-design.md` | Manual/UI/API case design |
| `test-data.md` | Data generation prompts |
| `automation-and-debugging.md` | Framework, specs, failure analysis |
| `documentation-and-summary.md` | README, reports, reflection |

**Format per entry:** Prompt → AI Response Summary → Validation Notes / Debugging Outcome.

---

## Supporting Artifacts (not in minimum tree but included)

| File | Purpose |
|------|---------|
| `test-plan.md` | Full test plan (scope, entry/exit, strategies) |
| `qa-risk-analysis.md` | Risk register with mitigations |
| `RTM.md` / `RTM.csv` | Requirements → tests traceability |
| `test-suite-scope.md` | 5–8 case limit compliance |

---

## Assessment Checklist

| Required item | Path | ✓ |
|---------------|------|---|
| FunctionalTestCase | `FunctionalTestCase/FunctionalTestCase.csv` | |
| PrismStructure | `PrismStructure/` | |
| project-info.md | `project-info.md` | |
| readme.md | `README.md` | |
| ai-prompts | `ai-prompts/*.md` | |
| Execution reports | `reports/` | |
| Iterative git commits | `.git/` | |
| Public repo URL | remote | |

---

## Optional (assessment mentions)

```
.cursor/          # Cursor rules, skills, MCP (optional)
```

Add if you configure Cursor rules/skills for the assessment.
