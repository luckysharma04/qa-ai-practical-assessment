const { test } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { getAssessmentBilling } = require('../../../Utils/dataGenerator');
const { expectInvoiceListPage } = require('../../../Utils/assertions');

test.describe('Invoice Smoke @Smoke', () => {
  test('TC-UI-SM-INVOICE — generate invoice and verify My Invoices', async ({
    uiFlows,
    pages,
    page,
  }) => {
    const billing = getAssessmentBilling().ui;

    await uiFlows.loginAs(defaultCustomer.email, defaultCustomer.password);
    await uiFlows.completeCodCheckout(billing);

    const invoice = pages.invoicePage();
    await invoice.open();
    await expectInvoiceListPage(page, invoice, { minRows: 1, billing });
  });
});
