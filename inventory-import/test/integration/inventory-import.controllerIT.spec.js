import { expect, describe, afterAll, it } from '@jest/globals';
import request from 'supertest';
import server from '../../src/index.js';
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SUCCESS_ACCEPTED,
} from '../../src/constants/http.status.constants.js';
import * as inventoryRequestPayload from '../../resources/inventoryImportRequest.json';

/** Reminder : Please put mandatory environment variables in the settings of your github repository **/
describe('Test inventory.import.controller.js', () => {
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
    response = await request(server).post(`/inventory`).send(payload);

    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(HTTP_STATUS_BAD_REQUEST);
  });

  it(`When payload body exists without correct inventory information, it should returns 400 http status`, async () => {
    let response = {};
    let payload = {};
    response = await request(server).post(`/inventory`).send(payload);

    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(HTTP_STATUS_BAD_REQUEST);
  });

  // Disabled because Needs Environment variables and update the inventoryEntry from your CTP project
  xit(`Test against CTP Project`, async () => {
    let response = {};
    const { body: inventoryRequestPayload } = await createApiRoot()
      .inventory()
      .withId({ ID: '1234' })
      .get()
      .execute();

    response = await request(server)
      .post(`/inventory`)
      .send(inventoryRequestPayload);

    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(HTTP_STATUS_SUCCESS_ACCEPTED);
    expect(response.body.message).toEqual('successfully created/updated');
  });

  afterAll(() => {
    // Enable the function below to close the application on server once all test cases are executed.

    if (server) {
      server.close();
    }
  });
});
