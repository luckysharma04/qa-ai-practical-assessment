const { chromium } = require('@playwright/test');

async function dump(page, label) {
  const tests = await page.locator('[data-test]').evaluateAll((els) =>
    [...new Set(els.map((el) => el.getAttribute('data-test')).filter(Boolean))].sort()
  );
  console.log(`\n=== ${label} ===`);
  console.log(tests.filter((t) => !t.startsWith('brand-') && !t.startsWith('category-') && !t.startsWith('product-01')).join('\n'));
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://practicesoftwaretesting.com/auth/login', { waitUntil: 'networkidle' });
  await dump(page, 'LOGIN PAGE');

  await page.goto('https://practicesoftwaretesting.com/auth/register', { waitUntil: 'networkidle' });
  await dump(page, 'REGISTER PAGE');

  await page.goto('https://practicesoftwaretesting.com/', { waitUntil: 'networkidle' });
  await page.locator('[data-test="product-name"]').first().click();
  await page.waitForLoadState('networkidle');
  await dump(page, 'PRODUCT DETAIL');

  await page.goto('https://practicesoftwaretesting.com/cart', { waitUntil: 'networkidle' });
  await dump(page, 'CART');

  await page.goto('https://practicesoftwaretesting.com/checkout', { waitUntil: 'networkidle' });
  await dump(page, 'CHECKOUT');

  await page.goto('https://practicesoftwaretesting.com/account', { waitUntil: 'networkidle' });
  await dump(page, 'ACCOUNT');

  await page.goto('https://practicesoftwaretesting.com/account/invoices', { waitUntil: 'networkidle' });
  await dump(page, 'INVOICES');

  await browser.close();
})();
