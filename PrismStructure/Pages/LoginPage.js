const { BasePage } = require('./BasePage');
const { ROUTES } = require('../Config/constants');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = this.byTestId('email');
    this.passwordInput = this.byTestId('password');
    this.loginButton = this.byTestId('login-submit');
    this.registerLink = this.byTestId('register-link');
    this.forgotPasswordLink = this.byTestId('forgot-password-link');
    this.loginForm = this.byTestId('login-form');
  }

  async open() {
    await this.goto(ROUTES.login);

    if (this.page.url().includes('/account')) {
      return;
    }

    try {
      await this.emailInput.waitFor({ state: 'visible', timeout: 15_000 });
    } catch {
      await this.page.goto(ROUTES.login, { waitUntil: 'domcontentloaded' });
      await this.waitForLoad();
      await this.emailInput.waitFor({ state: 'visible', timeout: 20_000 });
    }
  }

  async openFromNav() {
    await this.openSignIn();
  }

  async fillCredentials(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.loginButton.click();
  }

  async attemptLogin(email, password) {
    await this.fillCredentials(email, password);
    await this.submit();
  }

  async login(email, password) {
    await this.fillCredentials(email, password);
    await this.submit();
    await this.page.waitForURL('**/account**', { timeout: 15_000 });
  }

  async goToRegister() {
    await this.registerLink.click();
    await this.waitForLoad();
  }

  async getErrorText() {
    return this.page.locator('.alert-danger, [role="alert"]').first().textContent();
  }
}

module.exports = { LoginPage };
