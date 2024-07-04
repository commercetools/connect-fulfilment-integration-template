const ORDER_EXPORT_SUBSCRIPTION = 'your-subscription';

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
