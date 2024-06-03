import { expect, describe, it, afterEach } from '@jest/globals';
import sinon from 'sinon';
import { orderUpdatesHandler } from '../../src/controllers/order.updates.controller.js';
import configUtil from '../../src/utils/config.util.js';
import { HTTP_STATUS_BAD_REQUEST } from '../../src/constants/http.status.constants.js';

describe('order-updates.controller.spec', () => {
  afterEach(() => {
    sinon.restore();
  });

  it(`should return 400 HTTP status when message data is missing in incoming request.`, async () => {
    const dummyConfig = {
      clientId: 'dummy-ctp-client-id',
      clientSecret: 'dummy-ctp-client-secret',
      projectKey: 'dummy-ctp-project-key',
      scope: 'dummy-ctp-scope',
      region: 'dummy-ctp-region',
    };
    sinon.stub(configUtil, 'readConfiguration').callsFake(() => {
      return dummyConfig;
    });
    const mockRequest = {
      method: 'POST',
      url: '/',
      body: {},
    };
    const mockResponse = {
      status: () => {
        return {
          send: () => {},
        };
      },
    };
    const responseStatusSpy = sinon.spy(mockResponse, 'status');

    await orderUpdatesHandler(mockRequest, mockResponse);
    expect(responseStatusSpy.firstCall.firstArg).toEqual(
      HTTP_STATUS_BAD_REQUEST
    );
  });
});
