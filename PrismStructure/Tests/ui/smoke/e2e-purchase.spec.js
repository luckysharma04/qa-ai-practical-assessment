const { test } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { getAssessmentBilling } = require('../../../Utils/dataGenerator');
const { expectInvoiceListPage } = require('../../../Utils/assertions');

test.describe('E2E Purchase Smoke @Smoke @UI', () => {
  test('TC-UI-SM-003 — cart COD checkout double-confirm invoice and My Invoices', async ({
    uiFlows,
    pages,
    page,
  }) => {
    test.setTimeout(120_000);
    const billing = getAssessmentBilling().ui;

    await uiFlows.loginAs(defaultCustomer.email, defaultCustomer.password);
    const { billing: usedBilling } = await uiFlows.completeCodCheckout(billing);

    const invoice = pages.invoicePage();
    await invoice.open();
    await expectInvoiceListPage(page, invoice, { minRows: 1, billing: usedBilling });
  });
});
