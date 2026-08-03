const { test, expect } = require('../../../Fixtures/testFixtures');

test.describe('Catalog Smoke @Smoke', () => {
  test('TC-UI-SM-001 — home page displays products', async ({ homePage }) => {
    await homePage.open();
    const count = await homePage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });
});
