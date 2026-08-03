const { logApi } = require('../../Utils/logger');

class ProductApi {
  constructor(apiClient) {
    this.client = apiClient;
  }

  async listProducts() {
    const response = await this.client.get('/products');
    logApi('GET', '/products', response.status());
    return response;
  }

  async getFirstInStockProductId() {
    const response = await this.listProducts();
    const body = await response.json();
    const products = body.data || body;
    const inStock = products.find((p) => p.in_stock !== false && p.stock > 0);
    return (inStock || products[0])?.id;
  }
}

module.exports = { ProductApi };
