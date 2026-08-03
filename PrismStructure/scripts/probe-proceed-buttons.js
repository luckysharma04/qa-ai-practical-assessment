const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(25000);

  await page.goto('https://practicesoftwaretesting.com/auth/login');
  await page.locator('[data-test="email"]').fill('customer@practicesoftwaretesting.com');
  await page.locator('[data-test="password"]').fill('welcome01');
  await page.locator('[data-test="login-submit"]').click();
  await page.waitForURL('**/account**');

  await page.goto('https://practicesoftwaretesting.com/');
  await page.locator('[data-test="product-name"]').first().click();
  await page.waitForURL(/\/product\//);
  const resp = page.waitForResponse((r) => r.url().includes('/carts') && r.request().method() === 'POST');
  await page.locator('[data-test="add-to-cart"]').click();
  await resp;

  await page.goto('https://practicesoftwaretesting.com/checkout');
  await page.waitForTimeout(1000);

  for (const id of ['proceed-1', 'proceed-2', 'proceed-3']) {
    const el = page.locator(`[data-test="${id}"]`);
    console.log(id, 'count:', await el.count(), 'visible:', await el.isVisible());
  }

  const proceedText = page.getByRole('button', { name: /proceed/i });
  console.log('proceed text btn visible:', await proceedText.isVisible());

  await browser.close();
})();
