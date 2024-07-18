import { createApiRoot } from './create.client.js';

export async function getProductById(productId) {
  return await createApiRoot()
    .productProjections()
    .withId({ ID: productId })
    .get()
    .execute()
    .then((response) => response.body);
}
