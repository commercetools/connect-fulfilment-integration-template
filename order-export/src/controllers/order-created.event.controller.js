import { logger } from '../utils/logger.utils.js';
import { getOrderById } from '../clients/orders.query.client.js';

export const orderCreated = async (request, response, message) => {
  let order;
  if (message.payloadNotIncluded) {
    order = await getOrderById(message.resource.id);
  } else {
    order = message.order;
  }

  // Docs: https://docs.commercetools.com/api/projects/messages#order-created
  const messageData = {
    id: message.id,
    version: message.version,
    sequenceNumber: message.sequenceNumber,
    resource: message.resource,
    resourceVersion: message.resourceVersion,
    type: message.type,
    createdAt: message.createdAt,
    lastModifiedAt: message.lastModifiedAt,
  };

  // Docs: https://docs.commercetools.com/api/projects/orders#order
  const orderData = {
    id: order.id,
    version: order.version,
    orderNumber: order.orderNumber,
    purchaseOrderNumber: order.purchaseOrderNumber,
    customerId: order.customerId,
    customerEmail: order.customerEmail,
    // ...
  };

  logger.info(
    `Process orderCreated event id: ${messageData.id} orderNumber: ${orderData.orderNumber}`
  );
  response.status(200).send();
};
