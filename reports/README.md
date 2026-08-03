# Reports

Submission copies of Playwright execution artifacts.

## Generated outputs (source)

After a test run, Playwright writes to `PrismStructure/Reports/`:

| Artifact | Path | Purpose |
|----------|------|---------|
| HTML report | `playwright-report/` | Interactive UI — tests, traces, screenshots, videos |
| JSON results | `test-results.json` | Machine-readable suite summary |
| JUnit XML | `junit-results.xml` | CI integration (Jenkins, Azure DevOps, etc.) |
| Failure logs | `failure-logs/failures.log` | Human-readable failure summary |
| Failure logs (JSON) | `failure-logs/failures.json` | Structured failure details + attachment paths |
| Raw artifacts | `test-results/` | Per-test screenshots, videos, traces (on failure) |

## Copy for submission

```bash
# From repository root
npm run report:copy
```

Or manually:

```bash
cp -r PrismStructure/Reports/playwright-report reports/
cp PrismStructure/Reports/test-results.json reports/
cp PrismStructure/Reports/junit-results.xml reports/
cp -r PrismStructure/Reports/failure-logs reports/
```

Fill in `execution-summary.template.md` with pass/fail counts.
