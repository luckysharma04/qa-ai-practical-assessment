const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);

  // Login
  await page.goto('https://practicesoftwaretesting.com/auth/login');
  await page.locator('[data-test="email"]').fill('customer@practicesoftwaretesting.com');
  await page.locator('[data-test="password"]').fill('welcome01');
  await page.locator('[data-test="login-submit"]').click();
  await page.waitForURL('**/account**');
  console.log('Logged in:', page.url());

  // Add to cart
  await page.goto('https://practicesoftwaretesting.com/');
  await page.waitForLoadState('networkidle');
  await page.locator('[data-test="product-name"]').first().click();
  await page.waitForLoadState('networkidle');
  const oos = await page.locator('[data-test="out-of-stock"]').isVisible();
  console.log('Out of stock:', oos);
  await page.locator('[data-test="add-to-cart"]').click();
  await page.waitForTimeout(2000);

  const notif = page.locator('[data-test="notification-bar"]');
  if (await notif.isVisible()) console.log('Notification:', await notif.textContent());

  // Cart page
  await page.goto('https://practicesoftwaretesting.com/cart');
  await page.waitForLoadState('networkidle');
  const cartBody = await page.locator('body').innerText();
  console.log('CART text snippet:', cartBody.slice(0, 400));
  const cartTests = await page.locator('[data-test]').evaluateAll((els) =>
    els.map((el) => el.getAttribute('data-test')).filter(Boolean)
  );
  console.log('CART testids:', [...new Set(cartTests)].sort().join(', '));

  // Checkout
  await page.goto('https://practicesoftwaretesting.com/checkout');
  await page.waitForLoadState('networkidle');
  const body = await page.locator('body').innerText();
  console.log('Checkout text snippet:', body.slice(0, 500));
  const tests = await page.locator('[data-test]').evaluateAll((els) =>
    els.map((el) => el.getAttribute('data-test')).filter(Boolean)
  );
  console.log('CHECKOUT testids:', [...new Set(tests)].sort().join(', '));

  await browser.close();
})();
