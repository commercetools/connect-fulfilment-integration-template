import _ from 'lodash';
import {logger} from '../utils/logger.utils.js';
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_SUCCESS_ACCEPTED,
} from '../constants/http.status.constants.js';
import CustomError from '../errors/custom.error.js';
import {createInventoryEntry, getInventoryEntryByKey, updateInventoryEntry} from "../clients/query.client.js";

async function syncInventoryEntry(key, inventoryRequest, response) {
  let inventoryToBeSynced = await getInventoryEntryByKey(key);

  if( inventoryToBeSynced ) {
    logger.info(`Inventory found: ${inventoryToBeSynced.key}, updating the existing inventory.`);

    try {
      await updateInventoryEntry(inventoryToBeSynced);
    } catch (err) {
      logger.error(err);
      if (err.statusCode) return response.status(err.statusCode).send(err);
      return response.status(HTTP_STATUS_SERVER_ERROR).send(err);
    }
  } else {
    logger.info(`Creating new Inventory entry`);

    await createInventoryEntry(inventoryRequest).catch((error) => {
      throw new CustomError(
          HTTP_STATUS_BAD_REQUEST,
          `Bad request: ${error.message}`,
          error
      );
    });
  }
  logger.info(`Inventory(s) has been added/updated.`);

  return response.status(HTTP_STATUS_SUCCESS_ACCEPTED).send(
      { message: "successfully created/updated" }
  );
}

function getInvalidRequestResponse(response) {
  return response
      .status(HTTP_STATUS_BAD_REQUEST)
      .send(
          new CustomError(
              HTTP_STATUS_BAD_REQUEST,
              'Missing Inventory information in the request body.'
          )
      );
}

export const inventoryHandler = async (request, response) => {
  const inventoryRequest = request.body;
  if (_.isEmpty(inventoryRequest)) {
    return getInvalidRequestResponse(response);
  }

  let key = inventoryRequest.key;
  if(_.isEmpty(key)) {
    const sku = inventoryRequest.sku;
    const supplyChannel = inventoryRequest.supplyChannel;
    if (!_.isEmpty(sku) && !_.isEmpty(supplyChannel)) {
      key = _.isEmpty(supplyChannel.id) ? `${sku}+${inventoryRequest.supplyChannel.id}}` :
          `${sku}+${inventoryRequest.supplyChannel.key}}`
    } else {
      return getInvalidRequestResponse(response);
    }
  }

  return await syncInventoryEntry(key, inventoryRequest, response);
};
