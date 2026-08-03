const { BasePage } = require('./BasePage');
const { ROUTES } = require('../Config/constants');

class RegistrationPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameInput = this.byTestId('first-name');
    this.lastNameInput = this.byTestId('last-name');
    this.dobInput = this.byTestId('dob');
    this.countrySelect = this.byTestId('country');
    this.postalCodeInput = this.byTestId('postal_code');
    this.houseNumberInput = this.byTestId('house_number');
    this.streetInput = this.byTestId('street');
    this.cityInput = this.byTestId('city');
    this.stateInput = this.byTestId('state');
    this.phoneInput = this.byTestId('phone');
    this.emailInput = this.byTestId('email');
    this.passwordInput = this.byTestId('password');
    this.registerButton = this.byTestId('register-submit');
    this.registerForm = this.byTestId('register-form');
  }

  async open() {
    await this.goto(ROUTES.register);
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 20_000 });
  }

  /**
   * @param {object} user
   * @param {string} user.firstName
   * @param {string} user.lastName
   * @param {string} user.dob - YYYY-MM-DD
   * @param {string} user.country
   * @param {string} user.postalCode
   * @param {string} user.houseNumber
   * @param {string} user.street
   * @param {string} user.city
   * @param {string} user.state
   * @param {string} user.phone
   * @param {string} user.email
   * @param {string} user.password
   */
  async fillRegistrationForm(user) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.dobInput.fill(user.dob);

    const countryOption = this.countrySelect.locator('option').nth(1);
    const countryValue = await countryOption.getAttribute('value');
    if (countryValue) {
      await this.countrySelect.selectOption(countryValue);
    } else if (user.country) {
      await this.countrySelect.selectOption(user.country);
    }

    await this.postalCodeInput.fill(user.postalCode);
    if (user.houseNumber) {
      await this.houseNumberInput.fill(user.houseNumber);
    }
    await this.streetInput.fill(user.street);
    await this.cityInput.fill(user.city);
    await this.stateInput.fill(user.state);
    await this.phoneInput.fill(user.phone);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
  }

  async submit() {
    await this.registerButton.click();
  }

  async register(user) {
    await this.fillRegistrationForm(user);
    await this.submit();
    await this.page.waitForURL(/\/(account|auth\/login)/, { timeout: 20_000 });
  }

  async getErrorText() {
    return this.page.locator('.alert-danger, [role="alert"]').first().textContent();
  }
}

module.exports = { RegistrationPage };
