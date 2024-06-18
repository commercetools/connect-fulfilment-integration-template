import { expect, describe, it, jest, afterAll } from '@jest/globals';
import configUtil from '../../src/utils/config.utils.js';
import { HTTP_STATUS_BAD_REQUEST } from '../../src/constants/http.status.constants.js';
import request from 'supertest';
import server from '../../src/index.js';

describe('inventory-import.controller.spec', () => {
  it(`should return 400 HTTP status when message data is missing in incoming request.`, async () => {
    const dummyConfig = {
      clientId: 'dummy-ctp-client-id',
      clientSecret: 'dummy-ctp-client-secret',
      projectKey: 'dummy-ctp-project-key',
      scope: 'dummy-ctp-scope',
      region: 'dummy-ctp-region',
    };

    expect(dummyConfig).toBeDefined();
    jest
      .spyOn(configUtil, 'readConfiguration')
      .mockImplementation(({ success }) => success(dummyConfig));

    const response = await request(server).post(`/order-export`).send({});

    expect(response.body.statusCode).toEqual(HTTP_STATUS_BAD_REQUEST);
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });
});
