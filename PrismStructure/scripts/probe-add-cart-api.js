const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(25000);
  const t = (id) => page.locator(`[data-test="${id}"]`);

  await page.goto('https://practicesoftwaretesting.com/auth/login');
  await page.waitForLoadState('networkidle');
  await t('email').fill('customer@practicesoftwaretesting.com');
  await t('password').fill('welcome01');
  await t('login-submit').click();
  await page.waitForURL('**/account**');

  await page.goto('https://practicesoftwaretesting.com/');
  await page.waitForLoadState('networkidle');
  await t('product-name').first().click();
  await page.waitForLoadState('networkidle');
  console.log('Product URL:', page.url());

  const resp = page.waitForResponse((r) => r.url().includes('carts') && r.request().method() === 'POST');
  await t('add-to-cart').click();
  try {
    const r = await resp;
    console.log('Cart POST status:', r.status(), r.url());
  } catch (e) {
    console.log('No cart POST response');
  }
  await page.waitForTimeout(1000);

  await page.goto('https://practicesoftwaretesting.com/checkout');
  await page.waitForLoadState('networkidle');
  console.log('product-title count:', await t('product-title').count());
  console.log('body:', await page.locator('body').innerText().slice(0, 300));

  await browser.close();
})();
