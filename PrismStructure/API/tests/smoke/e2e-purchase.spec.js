const { test } = require('../../../Fixtures/testFixtures');
const {
  apiRegistrationPayload,
  getApiInvoiceBilling,
} = require('../../../Utils/dataGenerator');
const {
  expectCapturedToken,
  expectCartBody,
  expectInvoiceBody,
  expectInvoiceListed,
  expectDeleteCartResponse,
  expectProductListBody,
} = require('../../../Utils/apiAssertions');

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

    expectCapturedToken(result.token);
    expectProductListBody({ data: result.products });

    expectCartBody(result.verifiedCart, {
      cartId: result.cartId,
      productId: result.productId,
      quantity: 1,
      lineCount: 1,
    });

    expectInvoiceBody(result.invoice, billing);
    expectInvoiceListed(result.invoices, result.invoice, billing);

    await expectDeleteCartResponse(result.deleteCartResponse);
  });
});
