# QA AI Practical Assessment — Toolshop

Practice Software Testing Toolshop (Sprint 5) — manual functional tests, UI automation, and API automation using **Playwright** and the **Prism Framework** (JavaScript).

**SUT:**
- UI: https://practicesoftwaretesting.com/
- API: https://api.practicesoftwaretesting.com/api/documentation

---

## Project Structure

```
qa-ai-practical-assessment/
├── FunctionalTestCase/          # Manual test cases (CSV)
├── PrismStructure/              # Playwright UI + API automation
├── project-info.md              # Requirements, AI workflow, scope
├── README.md                    # This file
├── package.json                 # Root scripts → PrismStructure
├── test-data/                   # Shared JSON fixtures
├── reports/                     # Execution reports (submission evidence)
├── screenshots/                 # Manual / failure screenshots
├── ai-prompts/                   # Cursor AI prompt history
├── test-plan.md                 # Test plan
├── qa-risk-analysis.md          # Risk register
├── RTM.md / RTM.csv             # Requirements traceability matrix
└── PROJECT-STRUCTURE.md         # Folder guide
```

See **[PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md)** for detailed folder explanations.

---

## Prerequisites

- **Node.js** 18+ (20 recommended)
- **npm**
- Internet access (public SUT)
- **Git**

---

## Setup

```bash
# Clone repository
git clone <your-repo-url>
cd qa-ai-practical-assessment

# Install root + PrismStructure dependencies
npm install

# Install Playwright browser
cd PrismStructure
npx playwright install chromium
cd ..
```

---

## Test Data

| Location | Purpose |
|----------|---------|
| `test-data/users.json` | Default customer / admin credentials |
| `test-data/billing.json` | Valid billing for checkout / invoice |
| `test-data/invoice-payload.example.json` | API invoice POST template |
| `PrismStructure/Data/` | Automation runtime data modules |
| `PrismStructure/Utils/dataGenerator.js` | Dynamic emails (faker) |

Default smoke user: `customer@practicesoftwaretesting.com` / `welcome01`

---

## Running Tests

### Automation (from repository root)

```bash
npm run test:smoke           # All @Smoke (UI + API)
npm run test:regression      # All @Regression
npm run test:ui:smoke        # UI smoke only
npm run test:api:smoke       # API smoke only
npm run test:ui:regression   # UI regression only
npm run test:api:regression  # API regression only
npm run report               # Open Playwright HTML report
```

### Manual tests

1. Open `FunctionalTestCase/FunctionalTestCase.csv`
2. Execute steps in Excel or any CSV viewer
3. Update **Status** column (Passed / Failed)
4. Save screenshots to `screenshots/` for key flows

---

## Reports & Evidence

| Output | Location |
|--------|----------|
| Playwright HTML (generated) | `PrismStructure/Reports/playwright-report/` |
| Copy for submission | `reports/playwright-report/` |
| JSON results | `PrismStructure/Reports/test-results.json` → copy to `reports/` |
| Execution summary | `reports/execution-summary.template.md` |
| Screenshots | `screenshots/` |

After a full pass, copy reports and fill `reports/execution-summary.template.md`.

---

## Assessment Compliance

| Artifact | Path | Status |
|----------|------|--------|
| Manual cases | `FunctionalTestCase/FunctionalTestCase.csv` | 8 cases (3 Smoke + 5 Regression) |
| UI automation | `PrismStructure/Tests/ui/` | @Smoke / @Regression (5–8 target) |
| API automation | `PrismStructure/API/tests/` | @Smoke / @Regression (5–8 target) |
| project-info | `project-info.md` | Required |
| AI prompts | `ai-prompts/` | 5 files |
| README | `README.md` | Required |
| Git history | iterative commits | Required |

---

## Traceability

- **RTM:** `RTM.md` / `RTM.csv`
- **Test plan:** `test-plan.md`
- **Risk analysis:** `qa-risk-analysis.md`

---

## AI Tooling

Primary tool: **Cursor AI**. Prompt history documented in `ai-prompts/`.

---

## License

Assessment submission — Practice Software Testing demo application.
