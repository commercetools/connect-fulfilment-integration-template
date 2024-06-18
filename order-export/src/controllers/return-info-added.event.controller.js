import { logger } from '../utils/logger.utils.js';

export const returnInfo = async (request, response, message) => {
  // Docs: https://docs.commercetools.com/api/projects/messages#order-created
  const messageData = {
    id: message.id,
    version: message.version,
    sequenceNumber: message.sequenceNumber,
    resource: message.resource,
    resourceVersion: message.resourceVersion,
    type: message.type,
    resourceUserProvidedIdentifiers: message.resourceUserProvidedIdentifiers,
    returnInfo: message.returnInfo,
    createdAt: message.createdAt,
    lastModifiedAt: message.lastModifiedAt,
  };

  // Docs: https://docs.commercetools.com/api/projects/messages#return-info-added
  const returnInfoData = {
    items: message.returnInfo.items,
    returnTrackingId: message.returnInfo.returnTrackingId,
    returnDate: message.returnInfo.returnDate,
  };

  logger.info(
    `Process returnInfo event id: ${messageData.id} returnTrackingId: ${returnInfoData.returnTrackingId}`
  );
  response.status(200).send();
};
