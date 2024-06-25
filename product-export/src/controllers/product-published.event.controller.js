import { logger } from '../utils/logger.utils.js';

export const productPublished = async (request, response, message) => {
  // Docs: https://docs.commercetools.com/api/projects/messages#product-published
  const messageData = {
    id: message.id,
    version: message.version,
    sequenceNumber: message.sequenceNumber,
    resource: message.resource,
    resourceVersion: message.resourceVersion,
    type: message.type,
    removedImageUrls: message.removedImageUrls,
    productProjection: message.productProjection,
    scope: message.scope,
    createdAt: message.createdAt,
    lastModifiedAt: message.lastModifiedAt,
  };

  // Docs: https://docs.commercetools.com/api/projects/productProjections#productprojection
  const productProjectionsData = {
    id: message.productProjection.id,
    version: message.productProjection.version,
    productType: message.productProjection.productType,
    name: message.productProjection.name,
    slug: message.productProjection.slug,
    categories: message.productProjection.categories,
    masterVariant: message.productProjection.masterVariant,
    variants: message.productProjection.variants,
    createdAt: message.productProjection.createdAt,
    lastModifiedAt: message.productProjection.lastModifiedAt,
    // ...
  };

  logger.info(
    `Process product published event id: ${messageData.id} product name: ${productProjectionsData.name}`
  );
  response.status(200).send();
};
