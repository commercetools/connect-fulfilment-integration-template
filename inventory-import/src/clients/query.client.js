import { createApiRoot } from './create.client.js';

export async function getInventoryEntryByKey(key) {
  return await createApiRoot()
    .inventory()
    .withKey({
      ID: Buffer.from(key).toString(),
    })
    .get()
    .execute()
    .then((response) => response.body);
}

export async function createInventoryEntry(inventoryEntryToBeCreated) {
  const request = {
    key: inventoryEntryToBeCreated.key,
    sku: inventoryEntryToBeCreated.sku,
    quantityOnStock: inventoryEntryToBeCreated.quantityOnStock,
    supplyChannel: inventoryEntryToBeCreated.supplyChannel,
  };

  return await createApiRoot().inventory().post({ body: request }).execute();
}

export async function updateInventoryEntry(inventoryEntryToBeUpdated) {
  const actionItem = {
    version: inventoryEntryToBeUpdated.version,
    actions: [
      {
        action: 'addQuantity',
        quantity: inventoryEntryToBeUpdated.quantity,
      },
    ],
  };

  return await createApiRoot()
    .inventory()
    .withId(inventoryEntryToBeUpdated.id)
    .post({ body: actionItem })
    .execute();
}
