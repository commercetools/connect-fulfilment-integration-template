import { logger } from '../utils/logger.utils.js';
import { getOrderById } from '../clients/orders.query.client.js';

export const returnInfo = async (request, response, message) => {
  let order;
  let returnInfo;

  if (message.payloadNotIncluded) {
    order = await getOrderById(message.resource.id);
    returnInfo = order.returnInfo;
  } else {
    order = message.order;
    returnInfo = message.returnInfo;
  }

  // Docs: https://docs.commercetools.com/api/projects/messages#order-created
  const messageData = {
    id: message.id,
    version: message.version,
    sequenceNumber: message.sequenceNumber,
    resource: message.resource,
    resourceVersion: message.resourceVersion,
    type: message.type,
    resourceUserProvidedIdentifiers: message.resourceUserProvidedIdentifiers,
    createdAt: message.createdAt,
    lastModifiedAt: message.lastModifiedAt,
  };

  // Docs: https://docs.commercetools.com/api/projects/messages#return-info-added
  const returnInfoData = {
    items: returnInfo.items,
    returnTrackingId: returnInfo.returnTrackingId,
    returnDate: returnInfo.returnDate,
  };

  logger.info(
    `Process returnInfo event id: ${messageData.id} returnTrackingId: ${returnInfoData.returnTrackingId}`
  );
  response.status(200).send();
};
