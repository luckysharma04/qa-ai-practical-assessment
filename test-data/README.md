# Test Data (Faker-generated JSON)

Realistic test data for **Practice Software Testing Toolshop**, generated with `@faker-js/faker`.

## Regenerate

```bash
node test-data/generate-test-data.js
```

Requires `PrismStructure/node_modules` (run `npm install` at repo root first).

## Files

| File | Contents |
|------|----------|
| `users-valid.json` | Static SUT accounts + 5 Faker valid registration users (UI + API payloads) |
| `addresses.json` | Assessment billing reference + 5 Faker addresses (UI + API shapes) |
| `products.json` | Search terms, synthetic catalog items, filter/sort examples |
| `users-invalid.json` | Invalid login and registration scenarios |
| `negative-data.json` | Checkout, API, and search negative cases |
| `boundary-values.json` | Quantity, password, string length, unicode edge cases |
| `test-data-manifest.json` | Index of all data files |
| `users.json` | Quick reference static SUT credentials |
| `billing.json` | Legacy billing fixture (see `addresses.json`) |
| `invoice-payload.example.json` | API invoice POST template |

## Usage in automation

```javascript
const users = require('../../test-data/users-valid.json');
const billing = require('../../test-data/addresses.json').assessmentReference;

await registrationPage.register(users.validUsers[0]);
await checkoutPage.completeCashOnDeliveryCheckout(billing.ui);
```

Dynamic runtime data: `PrismStructure/Utils/dataGenerator.js`

## Notes

- **Unique emails** use timestamps — regenerate or use `validUsers[n].email` once per run.
- **Product IDs** on public SUT are dynamic; resolve via `GET /products` or UI at runtime.
- **Do not use real PII** — all Faker data is synthetic.
