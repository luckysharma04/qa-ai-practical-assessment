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
};

module.exports = { ROUTES, PAYMENT_METHOD, TAGS };
