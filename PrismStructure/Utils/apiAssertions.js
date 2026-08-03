const { expect } = require('@playwright/test');

function expectStatus(response, status) {
  expect(response.status()).toBe(status);
}

function expectStatusOneOf(response, statuses) {
  expect(statuses).toContain(response.status());
}

module.exports = { expectStatus, expectStatusOneOf };
