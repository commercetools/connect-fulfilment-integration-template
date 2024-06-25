const PRODUCT_PUBLISH_SUBSCRIPTION_KEY = 'your-subscription';

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
