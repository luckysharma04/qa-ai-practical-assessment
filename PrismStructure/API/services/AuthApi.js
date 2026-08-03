const { logApi } = require('../../Utils/logger');

class AuthApi {
  constructor(apiClient) {
    this.client = apiClient;
  }

  async login(email, password) {
    const response = await this.client.post('/users/login', { email, password });
    logApi('POST', '/users/login', response.status());
    return response;
  }

  async register(userPayload) {
    const response = await this.client.post('/users/register', userPayload);
    logApi('POST', '/users/register', response.status());
    return response;
  }

  async getAccessToken(email, password) {
    const response = await this.login(email, password);
    const body = await response.json();
    return body.access_token;
  }
}

module.exports = { AuthApi };
