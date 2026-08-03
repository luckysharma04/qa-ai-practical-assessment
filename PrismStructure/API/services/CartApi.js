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

  /** Add or update line item — POST /carts/{id} with product_id + quantity. */
  async addProduct(cartId, productId, quantity = 1) {
    const response = await this.client.post(`/carts/${cartId}`, {
      product_id: productId,
      quantity,
    });
    logApi('POST', `/carts/${cartId}`, response.status());
    return response;
  }

  /** POST /carts/{id} adds quantity to an existing line item. */
  async updateProductQuantity(cartId, productId, quantity) {
    return this.addProduct(cartId, productId, quantity);
  }

  async deleteCart(cartId) {
    const response = await this.client.delete(`/carts/${cartId}`);
    logApi('DELETE', `/carts/${cartId}`, response.status());
    return response;
  }
}

module.exports = { CartApi };
