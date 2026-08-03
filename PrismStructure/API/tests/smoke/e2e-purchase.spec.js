const { test, expect } = require('../../../Fixtures/testFixtures');
const {
  apiRegistrationPayload,
  getApiInvoiceBilling,
} = require('../../../Utils/dataGenerator');
const { expectStatus } = require('../../../Utils/apiAssertions');

test.describe('API E2E Purchase Smoke @Smoke', () => {
  test('TC-API-SM-003 — register login cart product invoice and cleanup', async ({
    apiFlows,
  }) => {
    const registrationPayload = apiRegistrationPayload();
    const billing = getApiInvoiceBilling();

    const result = await apiFlows.completePurchaseLifecycle({
      registrationPayload,
      billing,
      quantity: 1,
      cleanupCart: true,
    });

    expect(result.token).toBeTruthy();
    expect(result.products.length).toBeGreaterThan(0);
    expect(result.verifiedCart.cart_items.length).toBeGreaterThan(0);
    expect(result.verifiedCart.cart_items[0].product_id).toBe(result.productId);
    expect(result.invoice.id).toBeTruthy();
    expect(result.invoice.billing_street).toBe(billing.billing_street);

    const listed = result.invoices.find((row) => row.id === result.invoice.id);
    expect(listed).toBeTruthy();
    expect(listed.invoice_number).toBe(result.invoice.invoice_number);

    expect([200, 204]).toContain(result.deleteCartResponse.status());
  });
});
