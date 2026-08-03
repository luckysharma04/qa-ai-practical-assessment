const { BasePage } = require('./BasePage');
const { ROUTES } = require('../Config/constants');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.confirmButton = page.getByRole('button', { name: /confirm/i });
  }

  async open() {
    await this.goto(ROUTES.checkout);
    await this.waitForLoad();
  }

  /** Assessment requires two Confirm clicks for invoice generation. */
  async confirmInvoiceTwice() {
    await this.confirmButton.click();
    await this.confirmButton.click();
  }
}

module.exports = { CheckoutPage };
