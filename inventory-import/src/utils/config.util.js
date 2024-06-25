import CustomError from '../errors/custom.error.js';
import envValidators from '../validators/env-var.validators.js';
import { getValidateMessages } from '../validators/helpers.validators.js';

/**
 * Read the configuration env vars
 * (Add yours accordingly)
 *
 * @returns The configuration with the correct env vars
 */

function readConfiguration() {
  const envVars = {
    clientId: process.env.CTP_CLIENT_ID || 'e948zLoPYRG4AYIXVdGUMsk5',
    clientSecret: process.env.CTP_CLIENT_SECRET || 'a1JBPoapiphtjNLvaXl7KewlmI7bpkB-',
    projectKey: process.env.CTP_PROJECT_KEY || 'payment-integration',
    scope: process.env.CTP_SCOPE || 'manage_project:payment-integration',
    region: process.env.CTP_REGION || 'europe-west1.gcp',
  };

  const validationErrors = getValidateMessages(envValidators, envVars);

  if (validationErrors.length) {
    throw new CustomError(
      'InvalidEnvironmentVariablesError',
      'Invalid Environment Variables please check your .env file',
      validationErrors
    );
  }

  return envVars;
}

export default {
  readConfiguration,
};
