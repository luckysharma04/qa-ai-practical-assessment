const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://practicesoftwaretesting.com/auth/login');
  await page.locator('[data-test="email"]').fill('customer@practicesoftwaretesting.com');
  await page.locator('[data-test="password"]').fill('welcome01');
  await page.locator('[data-test="login-submit"]').click();
  await page.waitForURL('**/account**', { timeout: 15000 }).catch(() => {});
  console.log('URL after login:', page.url());
  const title = await page.locator('[data-test="page-title"]').textContent().catch(() => 'N/A');
  console.log('page-title:', title);

  await page.goto('https://practicesoftwaretesting.com/product/01KZ3H2EEXX9XHHG1FQRXYJ3M7');
  await page.waitForLoadState('networkidle');
  const ids = await page.locator('[data-test]').evaluateAll((els) =>
    [...new Set(els.map((e) => e.getAttribute('data-test')))].filter((t) => /cart|quantity|add|product/i.test(t))
  );
  console.log('PRODUCT ids:', ids);

  await page.locator('[data-test="add-to-cart"]').click().catch((e) => console.log('add-to-cart err', e.message));
  await page.goto('https://practicesoftwaretesting.com/cart');
  await page.waitForLoadState('networkidle');
  const cartIds = await page.locator('[data-test]').evaluateAll((els) =>
    [...new Set(els.map((e) => e.getAttribute('data-test')))]
  );
  console.log('CART ids:', cartIds.filter((t) => /cart|quantity|proceed|checkout/i.test(t)));

  await browser.close();
})();
