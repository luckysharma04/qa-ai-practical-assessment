const { test } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { getAssessmentBilling } = require('../../../Utils/dataGenerator');
const {
  expectCheckoutConfirmStep,
  expectBillingFieldsFilled,
} = require('../../../Utils/assertions');

test.describe('Checkout Smoke @Smoke @UI', () => {
  test('TC-UI-SM-CHECKOUT — complete COD checkout billing and payment steps', async ({
    uiFlows,
    page,
  }) => {
    test.setTimeout(120_000);
    const billing = getAssessmentBilling().ui;

    await uiFlows.loginAs(defaultCustomer.email, defaultCustomer.password);
    const checkout = await uiFlows.navigateToCheckout();

    await checkout.goToBillingStep();
    await checkout.fillBillingFields(billing);
    const usedBilling = await checkout.getBillingFieldValues();
    await expectBillingFieldsFilled(checkout, usedBilling);
    await checkout.clickEnabledProceed();
    await checkout.selectCashOnDelivery();

    await checkout.goToConfirmStep();
    await expectCheckoutConfirmStep(page, checkout);
  });
});
