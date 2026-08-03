const { test } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const {
  getNegativeApiCase,
  getApiInvoiceBilling,
} = require('../../../Utils/dataGenerator');
const {
  expectCartCreateResponse,
  expectInvoiceCreateResponse,
  expectRejectedResponse,
  expectDeleteCartResponse,
  expectStatus,
} = require('../../../Utils/apiAssertions');

test.describe('API Invoice Negative Regression @Regression @API', () => {
  test('TC-API-RG-004 — invalid invoice payloads are rejected', async ({
    apiServices,
  }) => {
    const token = await apiServices.auth.getAccessToken(
      defaultCustomer.email,
      defaultCustomer.password
    );
    apiServices.client.setToken(token);

    const cartResponse = await apiServices.cart.createCart();
    const { id: cartId } = await expectCartCreateResponse(cartResponse);

    const productId = await apiServices.product.getFirstInStockProductId();
    const addResponse = await apiServices.cart.addProduct(cartId, productId, 1);
    expectStatus(addResponse, 200);

    const invalidCartCase = getNegativeApiCase('negative-api-invalid-cart-id');
    const missingBillingCase = getNegativeApiCase('negative-api-missing-billing-field');
    const wrongPaymentCase = getNegativeApiCase('negative-api-wrong-payment-method');

    const invalidCartResponse = await apiServices.client.post(
      '/invoices',
      invalidCartCase.invoicePayload
    );
    await expectRejectedResponse(invalidCartResponse, invalidCartCase.expectedStatus);

    const missingBillingResponse = await apiServices.client.post('/invoices', {
      ...missingBillingCase.invoicePayload,
      cart_id: cartId,
    });
    await expectRejectedResponse(missingBillingResponse, missingBillingCase.expectedStatus);

    const wrongPaymentResponse = await apiServices.client.post('/invoices', {
      ...wrongPaymentCase.invoicePayload,
      cart_id: cartId,
    });
    await expectRejectedResponse(wrongPaymentResponse, wrongPaymentCase.expectedStatus);

    const validBilling = getApiInvoiceBilling();
    const validResponse = await apiServices.invoice.createInvoice(cartId, validBilling);
    await expectInvoiceCreateResponse(validResponse, validBilling);

    const deleteResponse = await apiServices.cart.deleteCart(cartId);
    await expectDeleteCartResponse(deleteResponse);
  });
});
