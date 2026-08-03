const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const t = (id) => page.locator(`[data-test="${id}"]`);

  await page.goto('https://practicesoftwaretesting.com/auth/login');
  await t('email').fill('customer@practicesoftwaretesting.com');
  await t('password').fill('welcome01');
  await t('login-submit').click();
  await page.waitForURL('**/account**');

  await page.goto('https://practicesoftwaretesting.com/');
  await t('product-name').first().click();
  await page.waitForURL(/\/product\//);
  await t('add-to-cart').click();
  await page.waitForResponse((r) => r.url().includes('/carts') && r.request().method() === 'POST');

  await page.goto('https://practicesoftwaretesting.com/checkout');
  await page.waitForTimeout(2000);

  const frames = page.frames();
  console.log('frame count:', frames.length);
  for (const frame of frames) {
    const url = frame.url();
    const tests = await frame.locator('[data-test]').evaluateAll((els) =>
      els.map((el) => el.getAttribute('data-test')).filter(Boolean)
    );
  console.log('frame', url, 'proceed ids:', tests.filter((x) => x.includes('proceed')));
  }

  const proceedBtn = page.getByRole('button', { name: /proceed to checkout/i });
  console.log('main proceed btn count:', await proceedBtn.count());
  if (await proceedBtn.count()) {
    const dt = await proceedBtn.evaluate((el) => el.getAttribute('data-test'));
    console.log('proceed btn data-test:', dt);
  }

  await browser.close();
})();
