const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { getAssessmentBilling } = require('../../../Utils/dataGenerator');

test.describe('Checkout Negative Regression @Regression', () => {
  test('TC-UI-RG-005 — empty cart invalid billing and single confirm block checkout', async ({
    uiFlows,
    pages,
  }) => {
    test.setTimeout(120_000);

    const billing = getAssessmentBilling().ui;

    await uiFlows.loginAs(defaultCustomer.email, defaultCustomer.password);

    const checkout = pages.checkoutPage();
    await checkout.openEmpty();
    expect(await checkout.isCartEmpty()).toBeTruthy();
    await expect(checkout.proceed1).not.toBeVisible();

    await uiFlows.addFirstProductToCart();
    await checkout.openWithItems();
    await checkout.goToBillingStep();
    await checkout.streetInput.fill('');
    await checkout.postalCodeInput.fill('');
    await checkout.houseNumberInput.fill('');
    await expect(checkout.proceed3).toBeDisabled();

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
    const invoicesAfterSingleConfirm = await invoice.getInvoiceRowCount();
    expect(invoicesAfterSingleConfirm).toBe(invoicesBefore);
  });
});
