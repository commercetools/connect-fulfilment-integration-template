import configUtils from '../utils/config.util.js';

/**
 * Configure Middleware. Example only. Adapt on your own
 */
export const getAuthMiddlewareOptions = () => {
  const config = configUtils.readConfiguration();
  return {
    host: config.authUrl,
    projectKey: config.projectKey,
    credentials: {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    },
    scopes: [config.scope ? config.scope : 'default'],
  };
};
