const { BasePage } = require('./BasePage');
const { ROUTES } = require('../Config/constants');

class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle = this.byTestId('page-title');
    this.firstNameInput = this.byTestId('first-name');
    this.lastNameInput = this.byTestId('last-name');
    this.emailInput = this.byTestId('email');
    this.phoneInput = this.byTestId('phone');
    this.streetInput = this.byTestId('street');
    this.postalCodeInput = this.byTestId('postal_code');
    this.cityInput = this.byTestId('city');
    this.stateInput = this.byTestId('state');
    this.countryInput = this.byTestId('country');
    this.updateProfileButton = this.byTestId('update-profile-submit');
    this.currentPasswordInput = this.byTestId('current-password');
    this.newPasswordInput = this.byTestId('new-password');
    this.newPasswordConfirmInput = this.byTestId('new-password-confirm');
    this.changePasswordButton = this.byTestId('change-password-submit');
  }

  async open() {
    await this.goto(ROUTES.profile);
    await this.waitForNetworkIdle();
  }

  async getTitle() {
    return this.pageTitle.textContent();
  }

  async getDisplayedEmail() {
    return this.emailInput.inputValue();
  }

  async getDisplayedFirstName() {
    return this.firstNameInput.inputValue();
  }

  async getDisplayedLastName() {
    return this.lastNameInput.inputValue();
  }

  /**
   * @param {object} profile
   */
  async updateProfile(profile) {
    if (profile.firstName) await this.firstNameInput.fill(profile.firstName);
    if (profile.lastName) await this.lastNameInput.fill(profile.lastName);
    if (profile.phone) await this.phoneInput.fill(profile.phone);
    if (profile.street) await this.streetInput.fill(profile.street);
    if (profile.postalCode) await this.postalCodeInput.fill(profile.postalCode);
    if (profile.city) await this.cityInput.fill(profile.city);
    if (profile.state) await this.stateInput.fill(profile.state);
    if (profile.country) await this.countryInput.fill(profile.country);
    await this.updateProfileButton.click();
    await this.waitForNetworkIdle();
  }

  async changePassword(currentPassword, newPassword, confirmPassword) {
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.newPasswordConfirmInput.fill(confirmPassword);
    await this.changePasswordButton.click();
    await this.waitForNetworkIdle();
  }
}

module.exports = { ProfilePage };
