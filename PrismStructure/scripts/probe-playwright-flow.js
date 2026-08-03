const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: 'https://practicesoftwaretesting.com' });
  const page = await context.newPage();
  page.setDefaultTimeout(25000);

  // Mimic test flow
  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');
  await page.getByTestId('email').fill('customer@practicesoftwaretesting.com');
  await page.getByTestId('password').fill('welcome01');
  await page.getByTestId('login-submit').click();
  await page.waitForURL('**/account**');
  console.log('Logged in');

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByTestId('product-name').first().click();
  await page.waitForLoadState('networkidle');
  console.log('Product URL:', page.url());

  const addBtn = page.getByTestId('add-to-cart');
  console.log('Add button visible:', await addBtn.isVisible(), 'enabled:', await addBtn.isEnabled());

  await addBtn.click();
  await page.waitForTimeout(800);

  await page.goto('/cart');
  await page.waitForLoadState('networkidle');
  const qty = page.getByTestId('cart-quantity');
  console.log('cart-quantity count:', await qty.count());
  console.log('cart-quantity visible:', await qty.isVisible().catch(() => false));

  await page.goto('/checkout');
  await page.waitForLoadState('networkidle');
  const titles = await page.getByTestId('product-title').count();
  console.log('checkout product-title count:', titles);

  await browser.close();
})();
