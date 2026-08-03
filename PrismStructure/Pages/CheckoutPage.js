const { BasePage } = require('./BasePage');
const { ROUTES } = require('../Config/constants');
const { PAYMENT_METHOD } = require('../Config/constants');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.streetInput = this.byTestId('street');
    this.cityInput = this.byTestId('city');
    this.stateInput = this.byTestId('state');
    this.countryInput = this.byTestId('country');
    this.postalCodeInput = this.byTestId('postal_code');
    this.houseNumberInput = this.byTestId('house_number');
    this.paymentMethodSelect = this.byTestId('payment-method');
    this.finishButton = this.byTestId('finish');
    this.proceed1 = this.byTestId('proceed-1');
    this.proceed2 = this.byTestId('proceed-2');
    this.proceed3 = this.byTestId('proceed-3');
    this.cartTotal = this.byTestId('cart-total');
  }

  async open() {
    await this.goto(ROUTES.checkout);
    await this.waitForNetworkIdle();
  }

  async clickProceedSteps() {
    const steps = [this.proceed1, this.proceed2, this.proceed3];
    for (const step of steps) {
      if (await step.isVisible()) {
        await step.click();
        await this.page.waitForTimeout(300);
      }
    }
  }

  /**
   * @param {object} billing
   * @param {string} billing.street
   * @param {string} billing.city
   * @param {string} billing.state
   * @param {string} billing.country
   * @param {string} billing.postalCode
   * @param {string} [billing.houseNumber]
   */
  async fillBillingAddress(billing) {
    await this.clickProceedSteps();
    if (await this.streetInput.isVisible()) {
      await this.streetInput.fill(billing.street);
    }
    if (await this.cityInput.isVisible()) {
      await this.cityInput.fill(billing.city);
    }
    if (await this.stateInput.isVisible()) {
      await this.stateInput.fill(billing.state);
    }
    if (await this.countryInput.isVisible()) {
      await this.countryInput.fill(billing.country);
    }
    if (await this.postalCodeInput.isVisible()) {
      await this.postalCodeInput.fill(billing.postalCode);
    }
    if (billing.houseNumber && await this.houseNumberInput.isVisible()) {
      await this.houseNumberInput.fill(billing.houseNumber);
    }
  }

  async selectCashOnDelivery() {
    await this.clickProceedSteps();
    if (await this.paymentMethodSelect.isVisible()) {
      await this.paymentMethodSelect.selectOption(PAYMENT_METHOD.cashOnDelivery);
    }
  }

  /** Assessment: invoice requires two Confirm/Finish actions. */
  async confirmInvoiceTwice() {
    await this.clickProceedSteps();
    await this.finishButton.click();
    await this.page.waitForTimeout(500);
    if (await this.finishButton.isVisible()) {
      await this.finishButton.click();
    }
  }

  /**
   * Full COD checkout through double confirm.
   * @param {object} billing - see fillBillingAddress
   */
  async completeCashOnDeliveryCheckout(billing) {
    await this.fillBillingAddress(billing);
    await this.selectCashOnDelivery();
    await this.confirmInvoiceTwice();
    await this.waitForNetworkIdle();
  }
}

module.exports = { CheckoutPage };
