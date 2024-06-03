import { createApiRoot } from './create.client.js';

export async function getOrderById(id) {
  return await createApiRoot()
    .orders()
    .withId({
      ID: Buffer.from(id).toString(),
    })
    .get()
    .execute()
    .then((response) => response.body);
}

async function updateOrder(id, orderVersion, orderUpdatesRequest) {
  // For reference: https://docs.commercetools.com/api/projects/orders#add-delivery
  const actionItem = {
    version: orderVersion,
    actions: [
      {
        action: 'addDelivery',
        items: orderUpdatesRequest.items,
        parcels: orderUpdatesRequest.parcels,
      },
      {
        action: 'changeShipmentState',
        shipmentState: orderUpdatesRequest.shipmentState,
      },
    ],
  };

  return await createApiRoot()
    .orders()
    .withId({
      ID: Buffer.from(id).toString(),
    })
    .post({ body: actionItem })
    .execute();
}

export async function updateOrderForDeliveryInfo(
  orderUpdatesRequest,
  orderToUpdate
) {
  const maxRetries = 6;
  let orderVersion = orderToUpdate.version;
  let err;
  for (let retries = 0; retries < maxRetries; retries++) {
    try {
      return await updateOrder(
        orderToUpdate.id,
        orderVersion,
        orderUpdatesRequest
      );
    } catch (e) {
      err = e;
      if (err.statusCode === 409) {
        const order = await getOrderById(orderUpdatesRequest.id);
        orderVersion = order.version;
        retries++;
      } else {
        throw e;
      }
    }
  }
  throw err;
}
