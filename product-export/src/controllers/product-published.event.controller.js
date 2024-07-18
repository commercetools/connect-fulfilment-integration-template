import { logger } from '../utils/logger.utils.js';
import CustomError from '../errors/custom.error.js';
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SUCCESS_ACCEPTED,
} from '../constants/http.status.constants.js';
import { decodeToJson } from '../utils/decoder.utils.js';
import { getProductById } from '../clients/products.query.client.js';

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
    if (messageBody.type !== 'productPublished') {
      throw new CustomError(
          HTTP_STATUS_SUCCESS_ACCEPTED,
          'Message type is not supported'
      );
    }

    let productProjection;
    if (messageBody.payloadNotIncluded) {
      productProjection = await getProductById(messageBody.resource.id);
    } else {
      productProjection = messageBody.productProjection;
    }

    // Docs: https://docs.commercetools.com/api/projects/productProjections#productprojection
    const productProjectionsData = {
      id: productProjection.id,
      version: productProjection.version,
      productType: productProjection.productType,
      name: productProjection.name,
      slug: productProjection.slug,
      categories: productProjection.categories,
      masterVariant: productProjection.masterVariant,
      variants: productProjection.variants,
      createdAt: productProjection.createdAt,
      lastModifiedAt: productProjection.lastModifiedAt,
      // ...
    };

    // TODO: Map composable commerce model to respective data model needed by 3rd part systems and
    //  call appropriate 3rd party methods.

    logger.info(
      `Process product published event id: ${productProjection.id} product name: ${productProjectionsData.name}`
    );
    response.status(200).send();
  } catch (err) {
    logger.error(err);
    if (err.statusCode) return response.status(err.statusCode).send(err);
    return response.status(500).send(err);
  }
};
