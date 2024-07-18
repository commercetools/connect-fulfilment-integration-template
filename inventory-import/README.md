# Inventory Import
This module provides an application based on [commercetools Connect](https://docs.commercetools.com/connect), can be used for syncing [Inventory](https://docs.commercetools.com/api/projects/inventory) from fulfilment systems to commercetools project.

## Get started

#### Install dependencies
```
$ npm install
```
#### Run unit test
```
$ npm run test:unit
```
#### Run integration test
```
$ npm run test:integration
```
#### Run the application in local environment
```
$ npm run start
```

## Development in local environment
Different from staging and production environments, in which the out-of-the-box setup and variables have been set by connect service during deployment, the inventory-import requires additional operations in local environment for development.

#### Set the required environment variables

Before starting the development, we advise users to create a .env file in order to help them in local development.

Refer [here](https://github.com/commercetools/connect-fulfilment-integration-template/tree/main?tab=readme-ov-file#deployment-configuration) for more details about the environment variables required for inventory-import application to run.