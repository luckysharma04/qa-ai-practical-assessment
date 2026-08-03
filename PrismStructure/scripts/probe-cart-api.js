const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const t = (id) => page.locator(`[data-test="${id}"]`);

  page.on('response', (r) => {
    if (r.url().includes('carts')) console.log('CART API', r.request().method(), r.status(), r.url());
  });

  await page.goto('https://practicesoftwaretesting.com/auth/login');
  await t('email').fill('customer@practicesoftwaretesting.com');
  await t('password').fill('welcome01');
  await t('login-submit').click();
  await page.waitForURL('**/account**');

  await page.goto('https://practicesoftwaretesting.com/');
  await t('product-name').first().click();
  await page.waitForURL(/\/product\//);
  console.log('product url', page.url());

  const [resp] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/carts') && r.request().method() === 'POST'),
    t('add-to-cart').click(),
  ]);
  console.log('POST body', await resp.text());

  await page.goto('https://practicesoftwaretesting.com/checkout');
  await page.waitForTimeout(3000);
  console.log('checkout snippet', (await page.locator('body').innerText()).includes('empty'));

  await browser.close();
})();
