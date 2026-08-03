/**
 * Application-wide constants (routes, payment methods, tags).
 */
const ROUTES = {
  home: '/',
  login: '/auth/login',
  register: '/auth/register',
  cart: '/cart',
  checkout: '/checkout',
  account: '/account',
  profile: '/account/profile',
  invoices: '/account/invoices',
  product: (id) => `/product/${id}`,
};

const PAYMENT_METHOD = {
  cashOnDelivery: 'cash-on-delivery',
};

const TAGS = {
  smoke: '@Smoke',
  regression: '@Regression',
  ui: '@UI',
  api: '@API',
};

/** Playwright project grep — AND match for layered tag execution. */
const TAG_GREP = {
  uiSmoke: /(?=.*@UI)(?=.*@Smoke)/,
  uiRegression: /(?=.*@UI)(?=.*@Regression)/,
  apiSmoke: /(?=.*@API)(?=.*@Smoke)/,
  apiRegression: /(?=.*@API)(?=.*@Regression)/,
  smoke: /@Smoke/,
  regression: /@Regression/,
  ui: /@UI/,
  api: /@API/,
};

module.exports = { ROUTES, PAYMENT_METHOD, TAGS, TAG_GREP };
