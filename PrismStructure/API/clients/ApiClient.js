const { request: playwrightRequest } = require('@playwright/test');
const { env } = require('../../Config/env');

/**
 * HTTP client wrapper using Playwright APIRequestContext.
 */
class ApiClient {
  constructor(requestContext, token = null) {
    this.request = requestContext;
    this.token = token;
    this.baseURL = env.apiBaseUrl;
  }

  headers(extra = {}) {
    const headers = { 'Content-Type': 'application/json', ...extra };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  async get(path, options = {}) {
    return this.request.get(`${this.baseURL}${path}`, {
      headers: this.headers(options.headers),
      ...options,
    });
  }

  async post(path, data, options = {}) {
    return this.request.post(`${this.baseURL}${path}`, {
      headers: this.headers(options.headers),
      data,
      ...options,
    });
  }

  async delete(path, options = {}) {
    return this.request.delete(`${this.baseURL}${path}`, {
      headers: this.headers(options.headers),
      ...options,
    });
  }

  async put(path, data, options = {}) {
    return this.request.put(`${this.baseURL}${path}`, {
      headers: this.headers(options.headers),
      data,
      ...options,
    });
  }

  setToken(token) {
    this.token = token;
  }

  static async create(token = null) {
    const request = await playwrightRequest.newContext();
    return new ApiClient(request, token);
  }
}

module.exports = { ApiClient };
