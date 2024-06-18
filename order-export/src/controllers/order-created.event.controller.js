import { logger } from '../utils/logger.utils.js';

export const orderCreated = async (request, response, message) => {
  // Docs: https://docs.commercetools.com/api/projects/messages#order-created
  const messageData = {
    id: message.id,
    version: message.version,
    sequenceNumber: message.sequenceNumber,
    resource: message.resource,
    resourceVersion: message.resourceVersion,
    type: message.type,
    order: message.order,
    createdAt: message.createdAt,
    lastModifiedAt: message.lastModifiedAt,
  };

  // Docs: https://docs.commercetools.com/api/projects/orders#order
  const orderData = {
    id: message.order.id,
    version: message.order.version,
    orderNumber: message.order.orderNumber,
    purchaseOrderNumber: message.order.purchaseOrderNumber,
    customerId: message.order.customerId,
    customerEmail: message.order.customerEmail,
    // ...
  };

  logger.info(
    `Process orderCreated event id: ${messageData.id} orderNumber: ${orderData.orderNumber}`
  );
  response.status(200).send();
};
