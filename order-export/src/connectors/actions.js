import { assertNonNullable } from '../utils/assert.utils.js';

const ORDER_EXPORT_SUBSCRIPTION =
  'ct-connect-fulfilment-order-export-subscription';

function buildDestination(config) {
  assertNonNullable(
    config.connectSubscriptionDestination,
    'CONNECT_SUBSCRIPTION_DESTINATION is required'
  );

  switch (config.connectSubscriptionDestination) {
    case 'GCP':
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
        `Unsupported subscription destination: ${config.connectSubscriptionDestination}. Valid options are 'GCP' or 'SNS'.`
      );
  }
}

export async function createSubscription(apiRoot, config) {
  await deleteOrderSubscription(apiRoot);

  const destination = buildDestination(config);

  await apiRoot
    .subscriptions()
    .post({
      body: {
        key: ORDER_EXPORT_SUBSCRIPTION,
        destination,
        messages: [
          {
            resourceTypeId: 'order',
            types: ['OrderCreated', 'ReturnInfoAdded'],
          },
        ],
      },
    })
    .execute();
}

export async function createOrderSubscription(apiRoot, topicName, projectId) {
  await deleteOrderSubscription(apiRoot);

  await apiRoot
    .subscriptions()
    .post({
      body: {
        key: ORDER_EXPORT_SUBSCRIPTION,
        destination: {
          type: 'GoogleCloudPubSub',
          topic: topicName,
          projectId,
        },
        messages: [
          {
            resourceTypeId: 'order',
            types: ['OrderCreated', 'ReturnInfoAdded'],
          },
        ],
      },
    })
    .execute();
}

export async function deleteOrderSubscription(apiRoot) {
  const {
    body: { results: subscriptions },
  } = await apiRoot
    .subscriptions()
    .get({
      queryArgs: {
        where: `key = "${ORDER_EXPORT_SUBSCRIPTION}"`,
      },
    })
    .execute();

  if (subscriptions.length > 0) {
    const subscription = subscriptions[0];

    await apiRoot
      .subscriptions()
      .withKey({ key: ORDER_EXPORT_SUBSCRIPTION })
      .delete({
        queryArgs: {
          version: subscription.version,
        },
      })
      .execute();
  }
}
