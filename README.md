# Leeds Council Tax Ingester

> Ingester for Housing Monitoring event store

See https://github.com/opnprd/housing-monitoring-eventstore

## Setup

```shell
npm install
```

## Operation

You will need to have provided an Google API Key in the envioronment variable API_KEY.
This is required for geocoding events based on the address data.

```shell
node . 
```

Further debug information can be set by setting the DEBUG environment variable on the command line as follows:

```shell
DEBUG=councilTaxIngester/* node .
```

