import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { createClient } from './build.client.js';
import configUtils from '../utils/config.util.js';

/**
 * Create client with apiRoot,
 * apiRoot can now be used to build requests to Composable Commerce API
 */
export const createApiRoot = ((root) => () => {
  if (root) {
    return root;
  }

  root = createApiBuilderFromCtpClient(createClient()).withProjectKey({
    projectKey: configUtils.readConfiguration().projectKey,
  });

  return root;
})();

/**
 * Example code to get the Project details
 * This code has the same effect as sending a GET
 * request to the commercetools Composable Commerce API without any endpoints.
 *
 */
export const getProject = async () => {
  return await createApiRoot().get().execute();
};
