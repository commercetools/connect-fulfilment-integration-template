import { createApiRoot } from './create.client.js';

export async function getInventoryEntryByKey(key) {
  return await createApiRoot()
    .inventory()
    .withKey({
      key: Buffer.from(key).toString(),
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

async function inventoryEntryUpdate(id, inventoryEntryVersion, inventoryRequest) {
  const actionItem = {
    version: inventoryEntryVersion,
    actions: [
      {
        action: 'changeQuantity',
        quantity: inventoryRequest.quantityOnStock,
      },
    ],
  };

  return await createApiRoot()
      .inventory()
      .withId({
        ID: Buffer.from(id).toString(),
      })
      .post({body: actionItem})
      .execute();
}

export async function updateInventoryEntry(
  inventoryEntryToBeUpdated,
  inventoryRequest
) {

  const maxRetries = 6;
  let inventoryEntryVersion = inventoryEntryToBeUpdated.version;
  let err;
  for (let retries = 0; retries < maxRetries; retries++) {
    try {
      return await inventoryEntryUpdate(inventoryEntryToBeUpdated.id, inventoryEntryVersion, inventoryRequest);
    } catch (e) {
      err = e;
      if (err.statusCode === 409) {
        const inventoryEntry = await getInventoryEntryByKey(inventoryEntryToBeUpdated.key);
        inventoryEntryVersion = inventoryEntry.version;
        retries++;
      } else {
        throw e;
      }
    }
  }
  throw err;
}
