const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { getAssessmentBilling } = require('../../../Utils/dataGenerator');

test.describe('Checkout Smoke @Smoke', () => {
  test('TC-UI-SM-CHECKOUT — complete COD checkout billing and payment steps', async ({
    uiFlows,
    pages,
    page,
  }) => {
    const billing = getAssessmentBilling().ui;

    await uiFlows.loginAs(defaultCustomer.email, defaultCustomer.password);
    const checkout = await uiFlows.navigateToCheckout();

    await checkout.fillBillingAddress(billing);
    await checkout.selectCashOnDelivery();

    await checkout.goToConfirmStep();
    await expect(page.getByTestId('finish')).toBeAttached();
    expect(await checkout.hasCheckoutLineItems()).toBeTruthy();
  });
});
