const CUSTOMER_CREATE_SUBSCRIPTION_KEY = 'your-subscription';

export async function createChangedProductSubscription(
  apiRoot,
  topicName,
  projectId
) {
  await deleteChangedProductSubscription(apiRoot);

  await apiRoot
    .subscriptions()
    .post({
      body: {
        key: CUSTOMER_CREATE_SUBSCRIPTION_KEY,
        destination: {
          type: 'GoogleCloudPubSub',
          topic: topicName,
          projectId,
        },
        messages: [
          {
            resourceTypeId: 'product',
            types: ['ProductUpdated'],
          },
        ],
      },
    })
    .execute();
}

export async function deleteChangedProductSubscription(apiRoot) {
  const {
    body: { results: subscriptions },
  } = await apiRoot
    .subscriptions()
    .get({
      queryArgs: {
        where: `key = "${CUSTOMER_CREATE_SUBSCRIPTION_KEY}"`,
      },
    })
    .execute();

  if (subscriptions.length > 0) {
    const subscription = subscriptions[0];

    await apiRoot
      .subscriptions()
      .withKey({ key: CUSTOMER_CREATE_SUBSCRIPTION_KEY })
      .delete({
        queryArgs: {
          version: subscription.version,
        },
      })
      .execute();
  }
}
