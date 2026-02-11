import { assertNonNullable } from '../utils/assert.utils.js';

const PRODUCT_PUBLISH_SUBSCRIPTION_KEY =
  'ct-connect-fulfilment-product-export-subscription';

function buildDestination(config) {
  assertNonNullable(
    config.connectSubscriptionDestination,
    'CONNECT_SUBSCRIPTION_DESTINATION is required'
  );

  switch (config.connectSubscriptionDestination) {
    case 'GoogleCloudPubSub':
      assertNonNullable(
        config.connectGcpTopicName,
        'CONNECT_GCP_TOPIC_NAME is required for GCP destination'
      );
      assertNonNullable(
        config.connectGcpProjectId,
        'CONNECT_GCP_PROJECT_ID is required for GCP destination'
      );
      return {
        type: 'GoogleCloudPubSub',
        topic: config.connectGcpTopicName,
        projectId: config.connectGcpProjectId,
      };
    case 'SNS':
      assertNonNullable(
        config.connectAwsTopicArn,
        'CONNECT_AWS_TOPIC_ARN is required for SNS destination'
      );
      return {
        type: 'SNS',
        topicArn: config.connectAwsTopicArn,
        authenticationMode: 'IAM',
      };
    default:
      throw new Error(
        `Unsupported subscription destination: ${config.connectSubscriptionDestination}. Valid options are 'GoogleCloudPubSub' or 'SNS'.`
      );
  }
}

export async function createSubscription(apiRoot, config) {
  await deletePublishedProductSubscription(apiRoot);

  const destination = buildDestination(config);

  await apiRoot
    .subscriptions()
    .post({
      body: {
        key: PRODUCT_PUBLISH_SUBSCRIPTION_KEY,
        destination,
        messages: [
          {
            resourceTypeId: 'product',
            types: ['ProductPublished'],
          },
        ],
      },
    })
    .execute();
}

export async function createPublishedProductSubscription(
  apiRoot,
  topicName,
  projectId
) {
  await deletePublishedProductSubscription(apiRoot);

  await apiRoot
    .subscriptions()
    .post({
      body: {
        key: PRODUCT_PUBLISH_SUBSCRIPTION_KEY,
        destination: {
          type: 'GoogleCloudPubSub',
          topic: topicName,
          projectId,
        },
        messages: [
          {
            resourceTypeId: 'product',
            types: ['ProductPublished'],
          },
        ],
      },
    })
    .execute();
}

export async function deletePublishedProductSubscription(apiRoot) {
  const {
    body: { results: subscriptions },
  } = await apiRoot
    .subscriptions()
    .get({
      queryArgs: {
        where: `key = "${PRODUCT_PUBLISH_SUBSCRIPTION_KEY}"`,
      },
    })
    .execute();

  if (subscriptions.length > 0) {
    const subscription = subscriptions[0];

    await apiRoot
      .subscriptions()
      .withKey({ key: PRODUCT_PUBLISH_SUBSCRIPTION_KEY })
      .delete({
        queryArgs: {
          version: subscription.version,
        },
      })
      .execute();
  }
}
