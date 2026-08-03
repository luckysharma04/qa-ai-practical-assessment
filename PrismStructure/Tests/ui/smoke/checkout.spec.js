const { test } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { getAssessmentBilling } = require('../../../Utils/dataGenerator');
const {
  expectCheckoutConfirmStep,
  expectBillingFieldsPopulated,
} = require('../../../Utils/assertions');

test.describe('Checkout Smoke @Smoke @UI', () => {
  test('TC-UI-SM-CHECKOUT — complete COD checkout billing and payment steps', async ({
    uiFlows,
    page,
  }) => {
    const billing = getAssessmentBilling().ui;

    await uiFlows.loginAs(defaultCustomer.email, defaultCustomer.password);
    const checkout = await uiFlows.navigateToCheckout();

    await checkout.fillBillingAddress(billing);
    await expectBillingFieldsPopulated(checkout);
    await checkout.selectCashOnDelivery();

    await checkout.goToConfirmStep();
    await expectCheckoutConfirmStep(page, checkout);
  });
});
