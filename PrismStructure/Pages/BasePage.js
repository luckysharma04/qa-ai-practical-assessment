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

  async goto(path = '/', { retries = 2 } = {}) {
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        await this.page.goto(path, {
          waitUntil: 'domcontentloaded',
          timeout: 45_000,
        });
        await this.waitForLoad();
        return;
      } catch (error) {
        if (attempt === retries) throw error;
        await this.page.waitForTimeout(2_000);
      }
    }
  }

  async waitForLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(300);
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
    const navMenu = this.byTestId('nav-menu');
    if (await navMenu.isVisible()) {
      const menuButtons = navMenu.getByRole('button');
      const buttonCount = await menuButtons.count();
      if (buttonCount > 0) {
        await menuButtons.nth(buttonCount - 1).click();
        await this.page.waitForTimeout(500);
      }
    } else {
      const profileBtn = this.page
        .getByRole('button', { name: /\d{3}/ })
        .or(this.page.getByRole('button', { name: /doe/i }));
      await profileBtn.first().click();
      await this.page.waitForTimeout(500);
    }

    await this.page.evaluate(() => {
      const signOutLink = document.querySelector('[data-test="nav-sign-out"]');
      if (signOutLink) signOutLink.click();
    });
    await this.page.waitForTimeout(1000);
  }
}

module.exports = { BasePage };
