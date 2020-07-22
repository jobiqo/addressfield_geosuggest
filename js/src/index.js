import React from "react";
import ReactDOM from "react-dom";

import Geosuggest from "./components/Geosuggest";

($ => {
  Drupal.behaviors.addressfieldGeosuggest = {
    attach: () => {
      const elements = Drupal.settings.addressfield_geosuggest;
      elements.forEach(element => {
        let element_id = element.element_id;
        let values_elm_id = element.values_element_id;
        let default_values = [];
        let place_detail_fields = element.place_detail_fields;
        if (document.getElementById(values_elm_id).value != '') {
          default_values = JSON.parse(document.getElementById(values_elm_id).value);
        }
        else {
          default_values = element.default_values;
        }

        // Build an object with optional settings to be passed to the geosuggest
        // component.
        let settings = {};

        if ("available_countries" in element) {
          settings["country"] = element.available_countries;
        }

        if ("location_bias" in element && "radius" in element.location_bias) {
          settings["radius"] = element.location_bias.radius;
          settings["location"] = new google.maps.LatLng({
            lat: element.location_bias.lat,
            lng: element.location_bias.lng
          });
        }

        if ("bound_bias" in element) {
          settings["bounds"] = new google.maps.LatLngBounds(
            new google.maps.LatLng(
              element.bound_bias.swlat,
              element.bound_bias.swlng
            ),
            new google.maps.LatLng(
              element.bound_bias.nelat,
              element.bound_bias.nelng
            )
          );
        }

        if ("cardinality" in element) {
          settings["cardinality"] = element.cardinality;
        }

        if ("types" in element) {
          settings["types"] = [element.types];
        }

        ReactDOM.render(
          <Geosuggest
            valuesContainer={document.getElementById(values_elm_id)}
            defaultValues={default_values}
            placeholder={element.placeholder}
            settings={settings}
            placeDetailFields={place_detail_fields}
          />,
          document.getElementById(element_id)
        );
      });
    }
  };
})(jQuery);
