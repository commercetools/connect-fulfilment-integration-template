import { expect, describe, afterAll, it } from '@jest/globals';
import request from 'supertest';
import server from '../../src/index.js';
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SUCCESS_ACCEPTED,
} from '../../src/constants/http.status.constants.js';
import { createApiRoot } from '../../src/clients/create.client.js';

/** Reminder : Please put mandatory environment variables in the settings of your github repository **/
describe('Test order.updates.controller.js', () => {
  it(`When resource identifier is absent in URL, it should return 404 http status`, async () => {
    let response = {};
    // Send request to the connector application with following code snippet.

    response = await request(server).post(`/`);
    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(404);
  });

  it(`When payload body does not exist, it should returns 400 http status`, async () => {
    let response = {};
    // Send request to the connector application with following code snippet.
    let payload = {};
    response = await request(server).post(`/order-updates`).send(payload);

    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(HTTP_STATUS_BAD_REQUEST);
  });

  it(`When payload body exists without delivery and return Information in the request, it should returns 400 http status`, async () => {
    let response = {};
    let payload = {
      orderId: 'id',
      orderKey: 'key',
      orderNumber: 'orderNumber',
    };
    response = await request(server).post(`/order-updates`).send(payload);

    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(HTTP_STATUS_BAD_REQUEST);
  });

  it(`When payload body exists without order information in the request, it should returns 400 http status`, async () => {
    let response = {};
    let payload = { deliveryInfo: { key: '' } };
    response = await request(server).post(`/order-updates`).send(payload);

    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(HTTP_STATUS_BAD_REQUEST);
  });

  // Disabled because this test needs Environment variables and order from your CTP project
  xit(`Test against CTP Project`, async () => {
    let response = {};
    const { body: orderUpdatesRequestPayload } = await createApiRoot()
      .orders.withId({ ID: '1234' })
      .get()
      .execute();

    response = await request(server)
      .post(`/order-updates`)
      .send(orderUpdatesRequestPayload);

    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(HTTP_STATUS_SUCCESS_ACCEPTED);
    expect(response.body.message).toEqual('successfully updated');
  });

  afterAll(() => {
    // Enable the function below to close the application on server once all test cases are executed.

    if (server) {
      server.close();
    }
  });
});
