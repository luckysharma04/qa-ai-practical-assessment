const { PAYMENT_METHOD } = require('../../Config/constants');
const { logApi } = require('../../Utils/logger');

class InvoiceApi {
  constructor(apiClient) {
    this.client = apiClient;
  }

  async createInvoice(cartId, billing, paymentMethod = PAYMENT_METHOD.cashOnDelivery) {
    const payload = {
      ...billing,
      cart_id: cartId,
      payment_method: paymentMethod,
      payment_details: {},
    };
    const response = await this.client.post('/invoices', payload);
    logApi('POST', '/invoices', response.status());
    return response;
  }

  async listInvoices() {
    const response = await this.client.get('/invoices');
    logApi('GET', '/invoices', response.status());
    return response;
  }
}

module.exports = { InvoiceApi };
