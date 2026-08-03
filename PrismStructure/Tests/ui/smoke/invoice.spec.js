const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { getAssessmentBilling } = require('../../../Utils/dataGenerator');

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
    await invoice.waitForInvoiceRows(1);

    await expect(page.getByTestId('page-title')).toContainText(/invoice/i);
    const rowCount = await invoice.getInvoiceRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });
});
