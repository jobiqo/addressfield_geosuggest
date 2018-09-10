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
        let default_values = element.default_values;

        ReactDOM.render(
          <Geosuggest
            valuesContainer={document.getElementById(values_elm_id)}
            defaultValues={default_values}
          />,
          document.getElementById(element_id)
        );
      });
    }
  };
})(jQuery);
