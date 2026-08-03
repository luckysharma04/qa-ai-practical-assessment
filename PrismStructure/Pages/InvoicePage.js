const { BasePage } = require('./BasePage');
const { ROUTES } = require('../Config/constants');

class InvoicePage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle = this.byTestId('page-title');
    this.paginationNext = this.byTestId('pagination-next');
    this.paginationPrev = this.byTestId('pagination-prev');
    this.invoiceTable = this.page.locator('table');
    this.invoiceRows = this.page.locator('table tbody tr');
  }

  async open() {
    await this.goto(ROUTES.invoices);
    await this.waitForNetworkIdle();
    await this.pageTitle.waitFor({ state: 'visible', timeout: 15_000 });
  }

  async waitForInvoiceRows(minRows = 1) {
    await this.page.waitForFunction(
      (min) => document.querySelectorAll('table tbody tr').length >= min,
      minRows,
      { timeout: 20_000 }
    );
  }

  async getTitle() {
    return this.pageTitle.textContent();
  }

  async getInvoiceRowCount() {
    return this.invoiceRows.count();
  }

  async getLatestInvoiceNumber() {
    const firstCell = this.invoiceRows.first().locator('td').first();
    return firstCell.textContent();
  }

  async openLatestInvoiceDetails() {
    const detailsLink = this.invoiceRows.first().getByRole('link', { name: /details/i });
    if (await detailsLink.isVisible()) {
      await detailsLink.click();
      await this.waitForNetworkIdle();
    }
  }

  async hasInvoiceWithText(text) {
    return this.invoiceTable.getByText(text, { exact: false }).isVisible();
  }

  async goToNextPage() {
    if (await this.paginationNext.isVisible()) {
      await this.paginationNext.click();
      await this.waitForNetworkIdle();
    }
  }
}

module.exports = { InvoicePage };
