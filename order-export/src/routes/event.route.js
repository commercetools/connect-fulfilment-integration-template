import { Router } from 'express';

import { orderCreated } from '../controllers/order-created.event.controller.js';
import { returnInfo } from '../controllers/return-info-added.event.controller.js';

import CustomError from '../errors/custom.error.js';
import { logger } from '../utils/logger.utils.js';
import { decodeToJson } from '../utils/decoder.utils.js';
import {
  HTTP_STATUS_SUCCESS_ACCEPTED,
  HTTP_STATUS_BAD_REQUEST,
} from '../constants/http.status.constants.js';

const eventRouter = Router();

async function eventHandler(request, response) {
  try {
    // Check request body
    if (!request.body) {
      logger.error('Missing request body.');
      throw new CustomError(
        HTTP_STATUS_BAD_REQUEST,
        'Bad request: No Pub/Sub message was received'
      );
    }
    // Check if the body comes in a message
    if (!request.body.message || !request.body.message.data) {
      logger.error('Missing message data in incoming message');
      throw new CustomError(
        HTTP_STATUS_BAD_REQUEST,
        'Bad request: No message data in incoming message'
      );
    }

    const encodedMessageBody = request.body.message.data;

    // Docs: https://docs.commercetools.com/api/projects/subscriptions#messagedeliverypayload
    // messageBody: MessageDeliveryPayload
    const messageBody = decodeToJson(encodedMessageBody);

    switch (messageBody.type) {
      case 'OrderCreated':
        orderCreated(request, response, messageBody);
        break;
      case 'ReturnInfoAdded':
        returnInfo(request, response, messageBody);
        break;
      default:
        throw new CustomError(
          HTTP_STATUS_SUCCESS_ACCEPTED,
          'Message type is not supported'
        );
    }
  } catch (err) {
    logger.error(err);
    if (err.statusCode) return response.status(err.statusCode).send(err);
    return response.status(500).send(err);
  }
}

eventRouter.post('/', eventHandler);

export default eventRouter;
