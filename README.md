# Addressfield Geosuggest widget

This module provides a widget to select addresses for the addressfield module
based on the [ubilabs geosuggset](https://github.com/ubilabs/react-geosuggest/)
component.

# Configuration

The API key is via the variable `addressfield_geosuggest_api_key`. There is no
UI, so it has to be set via:

```php
drush vset addressfield_geosuggest_api_key [api_key]
```

There are some global settings, that can be configured through variables. If 
there is a setting as a variable and as widget setting, then the field setting
will override the global setting for this field.
Since there is currently no UI for the settings, you need to set them via:
```php
drush ev variable_set('[variable_name]', '[variable_value]');
# or
drush php 
variable_set('[variable_name]', '[variable_value]');
```

The following variables are available:

- `addressfield_geosuggest_available_countries`

Restricts the autocomplete to a specific country. The value is an array of 
ISO 316601 Alpha-2 country codes, case sensitive. E.g. `['at', 'ch']`.


- `addressfield_geosuggest_location_bias`

Define a location to bias the suggest. The value is an array with the 
geolocation and radius in km of the location. Example:
```php
[
  'lat' => 51.0,
  'lng' => 10.0,
  'radius' => 1000
];
```

- `addressfield_geosuggest_bound_bias`

Instead of a certain geolocation, a bounding box can be set. The value is an 
array with the South-West North-East geocordinates. This will override the
location bias described above. Example:
```php
[
  'swlat' => 45.8,
  'swlng' =>  5.9,
  'nelat' => 47.8,
  'nelng' => 10.4,
];
```

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
