import configUtils from '../utils/config.utils.js';

/**
 * Configure Middleware. Example only. Adapt on your own
 */
export const getHttpMiddlewareOptions = () => {
  return {
    host: `https://api.${
      configUtils.readConfiguration().region
    }.commercetools.com`,
  };
};
