import { createApiRoot } from './create.client.js';

export async function getMessageById(messageId) {
  return await createApiRoot()
    .messages()
    .withId({ ID: messageId })
    .get()
    .execute()
    .then((response) => response.body);
}
