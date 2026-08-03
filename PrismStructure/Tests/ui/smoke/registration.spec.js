const { test, expect } = require('../../../Fixtures/testFixtures');
const { registrationUser } = require('../../../Utils/dataGenerator');

test.describe('Registration Smoke @Smoke', () => {
  test('TC-UI-SM-REG — register new user and access account', async ({
    registrationPage,
    loginPage,
    page,
  }) => {
    const user = registrationUser();

    await registrationPage.open();
    await registrationPage.register(user);

    if (page.url().includes('/auth/login')) {
      await loginPage.login(user.email, user.password);
    }

    await expect(page.getByTestId('page-title')).toContainText(/my account/i);
    await expect(page.getByTestId('nav-sign-in')).not.toBeVisible();
  });
});
