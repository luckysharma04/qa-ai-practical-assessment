const { BasePage } = require('./BasePage');
const { ROUTES } = require('../Config/constants');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.getByLabel('Email', { exact: false });
    this.passwordInput = page.getByLabel('Password', { exact: false });
    this.loginButton = page.getByRole('button', { name: /login|sign in/i });
  }

  async open() {
    await this.goto(ROUTES.login);
    await this.waitForLoad();
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
