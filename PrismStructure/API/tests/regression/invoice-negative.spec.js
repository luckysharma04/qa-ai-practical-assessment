const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const {
  getNegativeApiCase,
  getApiInvoiceBilling,
} = require('../../../Utils/dataGenerator');
const { expectStatus, expectStatusOneOf } = require('../../../Utils/apiAssertions');

test.describe('API Invoice Negative Regression @Regression', () => {
  test('TC-API-RG-004 — invalid invoice payloads are rejected', async ({
    apiServices,
  }) => {
    const token = await apiServices.auth.getAccessToken(
      defaultCustomer.email,
      defaultCustomer.password
    );
    apiServices.client.setToken(token);

    const cartResponse = await apiServices.cart.createCart();
    expectStatus(cartResponse, 201);
    const { id: cartId } = await cartResponse.json();

    const productId = await apiServices.product.getFirstInStockProductId();
    await apiServices.cart.addProduct(cartId, productId, 1);

    const invalidCartCase = getNegativeApiCase('negative-api-invalid-cart-id');
    const missingBillingCase = getNegativeApiCase('negative-api-missing-billing-field');
    const wrongPaymentCase = getNegativeApiCase('negative-api-wrong-payment-method');

    const invalidCartPayload = {
      ...invalidCartCase.invoicePayload,
      cart_id: invalidCartCase.invoicePayload.cart_id,
    };
    const invalidCartResponse = await apiServices.client.post('/invoices', invalidCartPayload);
    expectStatusOneOf(invalidCartResponse, invalidCartCase.expectedStatus);

    const missingBillingPayload = {
      ...missingBillingCase.invoicePayload,
      cart_id: cartId,
    };
    const missingBillingResponse = await apiServices.client.post(
      '/invoices',
      missingBillingPayload
    );
    expectStatusOneOf(missingBillingResponse, missingBillingCase.expectedStatus);

    const wrongPaymentPayload = {
      ...wrongPaymentCase.invoicePayload,
      cart_id: cartId,
    };
    const wrongPaymentResponse = await apiServices.client.post(
      '/invoices',
      wrongPaymentPayload
    );
    expectStatusOneOf(wrongPaymentResponse, wrongPaymentCase.expectedStatus);

    const validBilling = getApiInvoiceBilling();
    const validResponse = await apiServices.invoice.createInvoice(cartId, validBilling);
    expectStatus(validResponse, 201);

    await apiServices.cart.deleteCart(cartId);
  });
});
