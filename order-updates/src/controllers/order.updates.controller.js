import _ from 'lodash';
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_SUCCESS_ACCEPTED,
} from '../constants/http.status.constants.js';
import CustomError from '../errors/custom.error.js';
import {
  updateOrderForDeliveryInfo,
  getOrderById,
} from '../clients/query.client.js';
import { logger } from '../utils/logger.utils.js';

const badRequestMessage = 'Missing order details or deliveryInfo/returnInfo information in the request body.';

function getInvalidRequestResponse(response) {
  logger.info(badRequestMessage);
  return response
    .status(HTTP_STATUS_BAD_REQUEST)
    .send(
      new CustomError(
        HTTP_STATUS_BAD_REQUEST,
        badRequestMessage
      )
    );
}

async function syncOrderUpdates(orderUpdatesRequest) {
  if (orderUpdatesRequest.deliveryInfo) {
    const orderToUpdate = await getOrderById(orderUpdatesRequest.id);
    await updateOrderForDeliveryInfo(orderUpdatesRequest, orderToUpdate);
    if (orderUpdatesRequest.deliveryInfo.shipmentState === 'Shipped') {
      //TODO: When the ShipmentState is 'Shipped' then call Checkout Payments API to capture the money
      // [Checkout Payments API](https://docs.commercetools.com/checkout/payments-api#paymentoperation)
    }
    logger.info(
      `Order updated: Added DeliveryInfo and updated Shipment status.`
    );
  } else {
    // TODO: When this return is triggered, Call Checkout Payments API to do a payment refund
    //  [Checkout Payments API](https://docs.commercetools.com/checkout/payments-api#paymentoperation)
  }
}

export const orderUpdatesHandler = async (request, response) => {
  const orderUpdatesRequest = request.body;
  if (_.isEmpty(orderUpdatesRequest)) {
    return getInvalidRequestResponse(response);
  }

  let id = orderUpdatesRequest.orderId;
  let key = orderUpdatesRequest.orderKey;
  if (
    (_.isEmpty(id) && _.isEmpty(key)) ||
    !(orderUpdatesRequest.deliveryInfo || orderUpdatesRequest.returnInfo)
  ) {
    return getInvalidRequestResponse(response);
  }

  try {
    await syncOrderUpdates(orderUpdatesRequest);
  } catch (err) {
    logger.error(`Couldn't update order, Error: ${err}`);
    const error = new CustomError(
      HTTP_STATUS_SERVER_ERROR,
      `Couldn't update Order: ${err.message}`,
      err
    );
    return response.status(error.statusCode).send(error);
  }

  return response
    .status(HTTP_STATUS_SUCCESS_ACCEPTED)
    .send({ message: 'successfully updated Order' });
};
