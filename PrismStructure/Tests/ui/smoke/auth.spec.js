const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');

test.describe('Login Smoke @Smoke', () => {
  test('TC-UI-SM-LOGIN — login with valid customer credentials', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.fillCredentials(defaultCustomer.email, defaultCustomer.password);
    await loginPage.submit();

    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByTestId('page-title')).toContainText(/my account/i);
    await expect(page.getByTestId('nav-sign-in')).not.toBeVisible();
  });
});
