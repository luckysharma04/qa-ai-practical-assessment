/**
 * BasePage — shared navigation, waits, and data-test helpers (Prism / Toolshop v5).
 */
class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  /** Resolve element by Toolshop data-test attribute. */
  byTestId(testId) {
    return this.page.getByTestId(testId);
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async waitForLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  async fillTestId(testId, value) {
    await this.byTestId(testId).fill(value);
  }

  async clickTestId(testId) {
    await this.byTestId(testId).click();
  }

  async isTestIdVisible(testId) {
    return this.byTestId(testId).isVisible();
  }

  async getPageTitleText() {
    return this.byTestId('page-title').textContent();
  }

  async openSignIn() {
    await this.clickTestId('nav-sign-in');
    await this.waitForLoad();
  }

  async signOut() {
    const signOut = this.page.getByRole('button', { name: /sign out|logout/i });
    if (await signOut.isVisible()) {
      await signOut.click();
      return;
    }
    const menu = this.page.getByRole('button', { name: /jane|customer|account/i });
    if (await menu.isVisible()) {
      await menu.click();
      await this.page.getByRole('link', { name: /sign out/i }).click();
    }
  }
}

module.exports = { BasePage };
