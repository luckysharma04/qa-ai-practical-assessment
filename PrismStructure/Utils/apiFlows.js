const { logStep } = require('./logger');

function assertOk(response, expectedStatus) {
  if (response.status() !== expectedStatus) {
    throw new Error(
      `Expected HTTP ${expectedStatus}, received ${response.status()} for ${response.url()}`
    );
  }
}

/**
 * Reusable API flows using APIRequestContext services.
 */
class ApiFlows {
  /**
   * @param {{ client: object, auth: object, cart: object, product: object, invoice: object }} services
   */
  constructor(services) {
    this.services = services;
  }

  async loginAndCaptureToken(email, password) {
    const response = await this.services.auth.login(email, password);
    const body = await response.json();
    const token = body.access_token;
    this.services.client.setToken(token);
    logStep('Captured access token');
    return { token, response, body };
  }

  async registerLoginAndCaptureToken(registrationPayload) {
    const registerResponse = await this.services.auth.register(registrationPayload);
    const loginResult = await this.loginAndCaptureToken(
      registrationPayload.email,
      registrationPayload.password
    );
    return { registerResponse, ...loginResult };
  }

  /**
   * Register → login → cart → products → add → verify → invoice → verify → cleanup.
   */
  async completePurchaseLifecycle({
    registrationPayload,
    billing,
    quantity = 1,
    cleanupCart = true,
  }) {
    const { auth, cart, product, invoice } = this.services;

    logStep('Register user');
    const registerResponse = await auth.register(registrationPayload);
    assertOk(registerResponse, 201);

    logStep('Login and capture token');
    const { token } = await this.loginAndCaptureToken(
      registrationPayload.email,
      registrationPayload.password
    );

    logStep('Create cart');
    const cartResponse = await cart.createCart();
    assertOk(cartResponse, 201);
    const { id: cartId } = await cartResponse.json();

    logStep('Get products');
    const productsResponse = await product.listProducts();
    assertOk(productsResponse, 200);
    const productsBody = await productsResponse.json();
    const products = productsBody.data || productsBody;

    const productId = await product.getFirstInStockProductId();

    logStep('Add product to cart');
    const addResponse = await cart.addProduct(cartId, productId, quantity);
    assertOk(addResponse, 200);

    logStep('Verify cart');
    const verifyCartResponse = await cart.getCart(cartId);
    assertOk(verifyCartResponse, 200);
    const verifiedCart = await verifyCartResponse.json();

    logStep('Generate invoice');
    const invoiceResponse = await invoice.createInvoice(cartId, billing);
    assertOk(invoiceResponse, 201);
    const invoiceBody = await invoiceResponse.json();

    logStep('Verify invoice list');
    const listResponse = await invoice.listInvoices();
    assertOk(listResponse, 200);
    const listBody = await listResponse.json();
    const invoices = listBody.data || listBody;

    let deleteCartResponse = null;
    if (cleanupCart) {
      logStep('Delete test cart');
      deleteCartResponse = await cart.deleteCart(cartId);
    }

    return {
      token,
      cartId,
      productId,
      products,
      verifiedCart,
      invoice: invoiceBody,
      invoices,
      deleteCartResponse,
    };
  }
}

module.exports = { ApiFlows, assertOk };
