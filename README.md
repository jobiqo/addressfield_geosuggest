# Addressfield Geosuggest widget

This module provides a widget to select addresses for the addressfield module
based on the [ubilabs geosuggset](https://github.com/ubilabs/react-geosuggest/)
component.

## Devlopment

### Client side code.

The module includes a small react app that is attached to each field. Webpack is
used to compile the code and to minimize the bundle size we use
[preact](http://preactjs.com/).

To make debugging easier, there is the option to watch the js code for changes
and generate a development bundle. This can be started with `npm run dev`.

Before committing you should run `npm run build`, which will generate a 
compressed version for production and also run [prettier](https://prettier.io/) 
to format js source code.

### Running tests

To run the tests, an API key has to be set. This is currently only possible 
through the environment variable `addressfield_geosuggest_api_key`.

You can run the tests for example using the cli:
```bash
export addressfield_geosuggest_api_key='[your api key]'
php ./scripts/run-tests.sh Addressfield
```
