const { chromium } = require('@playwright/test');

async function dump(page, label) {
  const tests = await page.locator('[data-test]').evaluateAll((els) =>
    [...new Set(els.map((el) => el.getAttribute('data-test')).filter(Boolean))].sort()
  );
  const filtered = tests.filter(
    (t) =>
      !t.startsWith('brand-') &&
      !t.startsWith('category-') &&
      !/^product-01/i.test(t) &&
      !t.startsWith('lang-')
  );
  console.log(`\n=== ${label} ===`);
  console.log(filtered.join('\n'));
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://practicesoftwaretesting.com/auth/login', { waitUntil: 'networkidle' });
  await page.locator('[data-test="email"]').fill('customer@practicesoftwaretesting.com');
  await page.locator('[data-test="password"]').fill('welcome01');
  await page.locator('[data-test="login-submit"]').click();
  await page.waitForLoadState('networkidle');

  await page.goto('https://practicesoftwaretesting.com/', { waitUntil: 'networkidle' });
  await page.locator('[data-test="product-name"]').first().click();
  await page.waitForLoadState('networkidle');
  await dump(page, 'PRODUCT (auth)');

  await page.locator('[data-test="add-to-cart"]').click();
  await page.waitForTimeout(1000);

  await page.goto('https://practicesoftwaretesting.com/cart', { waitUntil: 'networkidle' });
  await dump(page, 'CART (auth)');

  await page.goto('https://practicesoftwaretesting.com/checkout', { waitUntil: 'networkidle' });
  await dump(page, 'CHECKOUT (auth)');

  await page.goto('https://practicesoftwaretesting.com/account/profile', { waitUntil: 'networkidle' });
  await dump(page, 'PROFILE (auth)');

  await page.goto('https://practicesoftwaretesting.com/account/invoices', { waitUntil: 'networkidle' });
  await dump(page, 'INVOICES (auth)');

  await browser.close();
})();
