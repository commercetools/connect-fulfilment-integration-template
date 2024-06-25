import { createApiRoot } from '../clients/create.client.js';

import { deletePublishedProductSubscription } from './actions.js';

async function preUndeploy() {
  const apiRoot = createApiRoot();
  await deletePublishedProductSubscription(apiRoot);
}

async function run() {
  try {
    await preUndeploy();
  } catch (error) {
    process.stderr.write(`Post-undeploy failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}

run();
