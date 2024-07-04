import { logger } from '../utils/logger.utils.js';
import CustomError from '../errors/custom.error.js';
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SUCCESS_ACCEPTED,
} from '../constants/http.status.constants.js';
import { decodeToJson } from '../utils/decoder.utils.js';
import { getMessageById } from '../clients/messages.query.client.js';

export const productPublishedHandler = async (request, response) => {
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

    // Docs: https://docs.commercetools.com/api/projects/messages#message
    // message: Message
    let message;
    if (messageBody?.payloadNotIncluded) {
      message = getMessageById(messageBody.id);
    } else {
      message = messageBody;
    }

    if (message.type !== 'productPublished') {
      throw new CustomError(
        HTTP_STATUS_SUCCESS_ACCEPTED,
        'Message type is not supported'
      );
    }

    // Docs: https://docs.commercetools.com/api/projects/messages#product-published
    const messageData = {
      id: message.id,
      version: message.version,
      sequenceNumber: message.sequenceNumber,
      resource: message.resource,
      resourceVersion: message.resourceVersion,
      type: message.type,
      removedImageUrls: message.removedImageUrls,
      productProjection: message.productProjection,
      scope: message.scope,
      createdAt: message.createdAt,
      lastModifiedAt: message.lastModifiedAt,
    };

    // Docs: https://docs.commercetools.com/api/projects/productProjections#productprojection
    const productProjectionsData = {
      id: message.productProjection.id,
      version: message.productProjection.version,
      productType: message.productProjection.productType,
      name: message.productProjection.name,
      slug: message.productProjection.slug,
      categories: message.productProjection.categories,
      masterVariant: message.productProjection.masterVariant,
      variants: message.productProjection.variants,
      createdAt: message.productProjection.createdAt,
      lastModifiedAt: message.productProjection.lastModifiedAt,
      // ...
    };

    // TODO: Map composable commerce model to respective data model needed by 3rd part systems and
    //  call appropriate 3rd party methods.

    logger.info(
      `Process product published event id: ${messageData.id} product name: ${productProjectionsData.name}`
    );
    response.status(200).send();
  } catch (err) {
    logger.error(err);
    if (err.statusCode) return response.status(err.statusCode).send(err);
    return response.status(500).send(err);
  }
};
