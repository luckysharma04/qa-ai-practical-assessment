const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');

test.describe('Authentication Smoke @Smoke', () => {
  test('TC-UI-SM-002 — login with valid customer', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login(defaultCustomer.email, defaultCustomer.password);
    await expect(page.getByRole('button', { name: /logout|sign out/i })).toBeVisible();
  });
});
