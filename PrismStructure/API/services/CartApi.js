const { logApi } = require('../../Utils/logger');

class CartApi {
  constructor(apiClient) {
    this.client = apiClient;
  }

  async createCart() {
    const response = await this.client.post('/carts', {});
    logApi('POST', '/carts', response.status());
    return response;
  }

  async getCart(cartId) {
    const response = await this.client.get(`/carts/${cartId}`);
    logApi('GET', `/carts/${cartId}`, response.status());
    return response;
  }

  async addProduct(cartId, productId, quantity = 1) {
    const response = await this.client.post(`/carts/${cartId}/items`, {
      product_id: productId,
      quantity,
    });
    logApi('POST', `/carts/${cartId}/items`, response.status());
    return response;
  }
}

module.exports = { CartApi };
