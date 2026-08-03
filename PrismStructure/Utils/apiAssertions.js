const { expect } = require('@playwright/test');
const {
  expectLoginBody,
  expectRegisterBody,
  expectCartCreateBody,
  expectCartBody,
  expectInvoiceBody,
  expectInvoiceListItem,
  expectProductListBody,
  expectUnauthorizedBody,
  expectErrorBody,
  expectResourceId,
} = require('../API/schemas/apiSchemas');

function expectStatus(response, status) {
  expect(response.status()).toBe(status);
}

function expectStatusOneOf(response, statuses) {
  expect(statuses).toContain(response.status());
}

async function expectJsonResponse(response, expectedStatus, schemaFn, bodyArg) {
  expectStatus(response, expectedStatus);
  const body = await response.json();
  if (schemaFn) {
    schemaFn(body, bodyArg);
  }
  return body;
}

async function expectLoginResponse(response) {
  return expectJsonResponse(response, 200, expectLoginBody);
}

async function expectRegisterResponse(response, payload) {
  return expectJsonResponse(response, 201, expectRegisterBody, payload);
}

async function expectCartCreateResponse(response) {
  const body = await expectJsonResponse(response, 201, expectCartCreateBody);
  return body;
}

async function expectCartGetResponse(response, cartExpectations = {}) {
  const body = await response.json();
  expectStatus(response, 200);
  expectCartBody(body, cartExpectations);
  return body;
}

async function expectInvoiceCreateResponse(response, billing) {
  return expectJsonResponse(response, 201, expectInvoiceBody, billing);
}

async function expectInvoiceListResponse(response) {
  expectStatus(response, 200);
  const body = await response.json();
  expect(body).toHaveProperty('data');
  expect(Array.isArray(body.data)).toBe(true);
  return body;
}

async function expectProductListResponse(response) {
  return expectJsonResponse(response, 200, expectProductListBody);
}

async function expectUnauthorizedResponse(response) {
  expectStatusOneOf(response, [401, 403]);
  const body = await response.json();
  expectUnauthorizedBody(body);
  return body;
}

async function expectRejectedResponse(response, expectedStatuses) {
  expectStatusOneOf(response, expectedStatuses);
  const body = await response.json();
  expectErrorBody(body);
  return body;
}

async function expectDeleteCartResponse(response) {
  expectStatus(response, 204);
}

function expectInvoiceListed(invoices, createdInvoice, billing) {
  const match = invoices.find((row) => row.id === createdInvoice.id);
  expect(match, 'created invoice must appear in list').toBeDefined();
  expectInvoiceListItem(match, createdInvoice, billing);
  return match;
}

function expectCapturedToken(token) {
  expect(token).toBeTruthy();
  expect(typeof token).toBe('string');
  expect(token.split('.').length).toBe(3);
}

module.exports = {
  expectStatus,
  expectStatusOneOf,
  expectJsonResponse,
  expectLoginResponse,
  expectRegisterResponse,
  expectCartCreateResponse,
  expectCartGetResponse,
  expectInvoiceCreateResponse,
  expectInvoiceListResponse,
  expectProductListResponse,
  expectUnauthorizedResponse,
  expectRejectedResponse,
  expectDeleteCartResponse,
  expectInvoiceListed,
  expectCapturedToken,
  expectLoginBody,
  expectRegisterBody,
  expectCartBody,
  expectInvoiceBody,
  expectInvoiceListItem,
  expectProductListBody,
  expectResourceId,
};
