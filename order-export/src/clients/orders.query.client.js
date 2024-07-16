import { createApiRoot } from './create.client.js';

export async function getOrderById(orderId) {
  return await createApiRoot()
    .orders()
    .withId({ ID: orderId })
    .get()
    .execute()
    .then((response) => response.body);
}
