# Jest test suite for RKCP

## How to run

```shell
yarn install
yarn test
```

## Intro

Testing of API is much more about infrastructure, then about actual API calls. First if all we should have working environment. From Now on we should refer to defaults of rubykube/workbench. It is not something, what breaks any approaches, but the conventions of naming of environment variables and constants.


How do we configure those?

Environment variables should be set (otherwise defaults will be set in config/index.js):
  - PEATIO_API_URL
  - PEATIO_MANAGEMENT_API_URL
  - BARONG_API_URL
  - BARONG_JWT_PRIVATE_KEY
  - BARONG_JWT_PUBLIC_FILE


## Structure of tests

There are two groups of test for Barong and Peatio. Barong tests are in `barong` folder and Peatio are in `peatio`. 
Currently, example tests for Barong cover issuing JWT based on user credentials (configuration is in section `BARONG_TEST_USER` of `config/index.js`).
