const { test } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { getAssessmentBilling } = require('../../../Utils/dataGenerator');
const {
  expectEmptyCheckoutBlocked,
  expectBillingValidationBlocksProceed,
  expectInvoiceCountStable,
} = require('../../../Utils/assertions');

test.describe('Checkout Negative Regression @Regression @UI', () => {
  test('TC-UI-RG-005 — empty cart invalid billing and single confirm block checkout', async ({
    uiFlows,
    pages,
  }) => {
    test.setTimeout(120_000);

    const billing = getAssessmentBilling().ui;

    await uiFlows.loginAs(defaultCustomer.email, defaultCustomer.password);

    const checkout = pages.checkoutPage();
    await checkout.openEmpty();
    await expectEmptyCheckoutBlocked(checkout);

    await uiFlows.addFirstProductToCart();
    await checkout.openWithItems();
    await checkout.goToBillingStep();
    await checkout.streetInput.fill('');
    await checkout.postalCodeInput.fill('');
    await checkout.houseNumberInput.fill('');
    await expectBillingValidationBlocksProceed(checkout);

    const invoice = pages.invoicePage();
    await invoice.open();
    const invoicesBefore = await invoice.getInvoiceRowCount();

    await uiFlows.addFirstProductToCart();
    const orderCheckout = pages.checkoutPage();
    await orderCheckout.openWithItems();
    await orderCheckout.fillBillingAddress(billing);
    await orderCheckout.selectCashOnDelivery();
    await orderCheckout.confirmInvoiceOnce();

    await invoice.open();
    await expectInvoiceCountStable(invoice, invoicesBefore);
  });
});
