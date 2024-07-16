# connect-fulfilment-integration-template

This repository provides a [connect](https://docs.commercetools.com/connect) template for a fulfilment integration connector. This boilerplate code acts as a starting point for integration with external fulfilment service provider.

This template uses the [Order](https://docs.commercetools.com/api/projects/orders), [Product](https://docs.commercetools.com/api/projects/products), [Inventory](https://docs.commercetools.com/api/projects/inventory) etc., data models from commercetools composable commerce which can be used for querying store-specific product data to sync into external systems. Template is based on asynchronous [Subscriptions](https://docs.commercetools.com/api/projects/subscriptions) to keep the external systems up to date.

## Template Features
- NodeJS supported.
- Uses Express as web server framework.
- Uses [commercetools SDK](https://docs.commercetools.com/sdk/js-sdk-getting-started) for the commercetools-specific communication.
- Includes local development utilities in npm commands to build, start, test, lint & prettify code.
- Uses JSON formatted logger with log levels
- Setup sample unit and integration tests with [Jest](https://jestjs.io/) and [supertest](https://github.com/ladjs/supertest#readme)

## Prerequisite
#### 1. commercetools composable commerce API client
Users are expected to create API client responsible for fetching product and order details from composable commerce project, API client should have enough scope to be able to do so. These API client details are taken as input as an environment variable/ configuration for connect. Details of composable commerce project can be provided as environment variables (configuration for connect) `CTP_PROJECT_KEY` , `CTP_CLIENT_ID`, `CTP_CLIENT_SECRET`, `CTP_SCOPE`, `CTP_REGION`. For details, please read [Deployment Configuration](./README.md#deployment-configuration).

## Getting started
The template contains four separated modules:
- Inventory import: Provides a REST-API to users to handle stock updates status updates - [create](https://docs.commercetools.com/api/projects/inventory#inventoryentrydraft) or [update](https://docs.commercetools.com/api/projects/inventory#change-quantity) the InventoryEntry
- Order updates: Provides a REST-API to users to order updates during the post order process, shipping updates including packaging , parcel and other tracking details needs to be synced into ecommerce system from fulfillment system to be able to charge customers for the orders (in case of authorized payments) and also keep order upto date in ecommerce system to reflect right shipping, order status.
- Order export: Receives message from commercetools project once there is an order created, returnInfoAdded in commercetools store and sync orders created into fulfilment system on regular basis, this component is responsible in keeping fulfilment system up to date on orders and return requests.
- Product export: Receives message from commercetools project once there is an ProductPublished in commercetools and sync products into fulfilment system on regular basis, this component is responsible in keeping fulfilment system up to date.

Regarding the development of the modules, please refer to the following documentations:
- [Development of Inventory import](inventory-import/README.md)
- [Development of Order updates](order-updates/README.md)
- [Development of Product export](product-export/README.md)
- [Development of Order export](order-export/README.md)

#### 1. Develop your specific needs
In case of authorized payments implementation checkout to be able to charge customers,
- Implement to capture the money(calling Checkout).
  Reference: [Checkout Payments API](https://docs.commercetools.com/checkout/payments-api#paymentoperation) 

#### 2. Register as connector in commercetools Connect
Follow guidelines [here](https://docs.commercetools.com/connect/getting-started) to register the connector for public/private use.

## Deployment Configuration
In order to deploy your customized connector application on commercetools Connect, it needs to be published. For details, please refer to [documentation about commercetools Connect](https://docs.commercetools.com/connect/concepts)
In addition, in order to support connect, the fulfilment integration connector template has a folder structure as listed below
```
├── inventory-import
│   ├── src
│   ├── test
│   └── package.json
├── order-updates
│   ├── src
│   ├── test
│   └── package.json
├── product-export
│   ├── src
│   ├── test
│   └── package.json
├── order-export
│   ├── src
│   ├── test
│   └── package.json
└── connect.yaml
```

Connect deployment configuration is specified in `connect.yaml` which is required information needed for publishing of the application. Following is the deployment configuration used by fulfilment integration template modules
```
deployAs:
  - name: inventory-import
    applicationType: service
    endpoint: /inventory
    configuration:
      standardConfiguration:
        - key: CTP_PROJECT_KEY
          description: commercetools project key
          required: true
        - key: CTP_CLIENT_ID
          description: commercetools client ID
          required: true
        - key: CTP_REGION
          description: region of commercetools composable commerce project
          required: false
        - key: CTP_SCOPE
          description: commercetools client scope
          required: false
      securedConfiguration:
        - key: CTP_CLIENT_SECRET
          description: commercetools client secret
          required: true
  - name: order-updates
    applicationType: service
    endpoint: /order-updates
    configuration:
      standardConfiguration:
        - key: CTP_PROJECT_KEY
          description: commercetools project key
          required: true
        - key: CTP_CLIENT_ID
          description: commercetools client ID
          required: true
        - key: CTP_REGION
          description: region of commercetools composable commerce project
          required: false
        - key: CTP_SCOPE
          description: commercetools client scope
          required: false
      securedConfiguration:
        - key: CTP_CLIENT_SECRET
          description: commercetools client secret
          required: true
  - name: product-export
    applicationType: event
    endpoint: /product-export
    configuration:
      standardConfiguration:
        - key: CTP_PROJECT_KEY
          description: commercetools project key
          required: true
        - key: CTP_CLIENT_ID
          description: commercetools client ID
          required: true
        - key: CTP_REGION
          description: region of commercetools composable commerce project
          required: false
        - key: CTP_SCOPE
          description: commercetools client scope
          required: false
      securedConfiguration:
        - key: CTP_CLIENT_SECRET
          description: commercetools client secret
          required: true
  - name: order-export
    applicationType: event
    endpoint: /order-export
    configuration:
      standardConfiguration:
        - key: CTP_PROJECT_KEY
          description: commercetools project key
          required: true
        - key: CTP_CLIENT_ID
          description: commercetools client ID
          required: true
        - key: CTP_REGION
          description: region of commercetools composable commerce project
          required: false
        - key: CTP_SCOPE
          description: commercetools client scope
          required: false
      securedConfiguration:
        - key: CTP_CLIENT_SECRET
          description: commercetools client secret
          required: true        
```

Here you can see the details about various variables in configuration
- CTP_PROJECT_KEY: The key of commercetools composable commerce project.
- CTP_CLIENT_ID: The client ID of your commercetools composable commerce user account. It is used in commercetools client to communicate with commercetools composable commerce via SDK.
- CTP_CLIENT_SECRET: The client secret of commercetools composable commerce user account. It is used in commercetools client to communicate with commercetools composable commerce via SDK.
- CTP_SCOPE: The scope constrains the endpoints to which the commercetools client has access, as well as the read/write access right to an endpoint.
- CTP_REGION: As the commercetools composable commerce APIs are provided in six different region, it defines the region which your commercetools composable commerce user account belongs to.

## Recommendations
#### Implement your own test cases
We have provided sample unit and integration test cases with [Jest](https://jestjs.io/) and [supertest](https://github.com/ladjs/supertest#readme). The implementation is under `test` folder in all the modules. It is recommended to implement further test cases based on your own needs to test your development. 