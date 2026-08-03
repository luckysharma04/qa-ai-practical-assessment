const { test, expect } = require('../../../Fixtures/testFixtures');
const { registrationUser } = require('../../../Utils/dataGenerator');
const { expectAuthenticated } = require('../../../Utils/assertions');

test.describe('Registration Profile Regression @Regression', () => {
  test('TC-UI-RG-001 — register new user and verify profile details', async ({
    uiFlows,
    profilePage,
    page,
  }) => {
    const user = registrationUser();

    await uiFlows.registerAndLogin(user);
    await expectAuthenticated(page);

    await profilePage.open();
    await expect(page.getByTestId('page-title')).toContainText(/profile/i);

    await expect(profilePage.firstNameInput).toHaveValue(user.firstName);
    await expect(profilePage.lastNameInput).toHaveValue(user.lastName);
    await expect(profilePage.emailInput).toHaveValue(user.email);
  });
});
