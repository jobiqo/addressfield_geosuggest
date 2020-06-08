import React, { Component } from "react";
import Geosuggester from "react-geosuggest";

import RemoveButton from "./RemoveButton";

/**
 * Defines the mapping between the address compoments from the Google Geocoding
 * API and what the address field expects.
 */
const mapping = {
  country: "country",
  administrative_area_level_1: "administrative_area",
  administrative_area_level_2: "sub_administrative_area",
  locality: "locality"
};

/**
 * Retrieves the components needed for the for the address from the gmaps
 * component of geosuggest response.
 */
function getAddressComponents(gmapsComponents) {
  let res = {};

  // Go through all the returned gmaps components.
  gmapsComponents.forEach(component => {
    // Check if they are in the mapping, if yes, add it with the correct mapping
    // to the result object.
    component.types.forEach(type => {
      if (type in mapping) {
        res[mapping[type]] = component["short_name"];
      }
    });
  });

  // If the admin area level 2 is empty, but level 3 is present, then take that
  // as sub admin area.
  if (
    !("administrative_area_level_2" in gmapsComponents) &&
    "administrative_area_level_3" in gmapsComponents
  ) {
    res["sub_administrative_area"] =
      gmapsComponents["administrative_area_level_3"];
  }

  return res;
}

/**
 * Geosuggest react component, which renders one or more Geosuggester
 * components.
 */
class Geosuggest extends Component {
  _geoSuggest = [];

  static defaultProps = {
    placeholder: Drupal.t('Search locations'),
    settings: {},
  };

  constructor(props, defaultProps) {
    super(props, defaultProps);

    // Save the selected values into the components state, so that we don't have
    // to rely on the hidden element's value.
    this.state = {
      values: props.defaultValues
    };
  }

  /**
   * Handles the select event triggered by the Geosuggester components.
   *
   * @param int elementIdx The index of the element which was modified.
   * @param object suggest The response from the selection.
   */
  onSuggestSelect(elementIdx, suggest) {
    // @todo: figure out how to be able to remove an item.

    // Check if the location has been entered.
    // @todo: This doesn't work reliably, because of possible rounding errors
    // with the geo coordinates.
    const exists =
      this.state.values.filter(value => {
        // Check against the placeId by default, but since existing fields, don't
        // have that yet, we also need to check against the location.
        return (
          suggest["placeId"] == value["data"]["place_id"] ||
          (suggest["location"]["lat"] == value["data"]["latitude"] &&
            suggest["location"]["lng"] == value["data"]["longitude"])
        );
      }).length > 0;

    // @todo: Do something else if the location exists?
    if (!exists) {
      let address = getAddressComponents(suggest.gmaps.address_components);
      address["lat"] = suggest.location.lat;
      address["lng"] = suggest.location.lng;
      address["formatted_address"] = suggest.gmaps.formatted_address;
      address["data"] = suggest.gmaps;
      address["data"]["place_id"] = suggest.placeId;

      this.setState((prevState, props) => {
        let newValues;
        // If the index of the changed element is equal or greater, then we
        // the user entered a new value. Otherwise we changed an existing.
        if (elementIdx >= prevState.values.length) {
          newValues = [...prevState.values, address];
        } else {
          newValues = prevState.values.map((value, i) => {
            if (i === elementIdx) {
              return address;
            } else {
              return value;
            }
          });
        }
        // @todo: Should we do this somewhere else?
        this.props.valuesContainer.value = JSON.stringify(newValues);

        return {
          values: newValues
        };
      });
    }
  }

  /**
   * Removes an entry from the selection.
   *
   * @param index The index of the entry to remove.
   */
  removeItem(index) {
    this.setState((prevState, props) => {
      const newValues = prevState.values.filter((value, i) => {
        if (index == i) {
          return false;
        }

        return true;
      });

      this.props.valuesContainer.value = JSON.stringify(newValues);

      return {
        values: newValues
      };
    });
  }

  renderGeoInput(index = undefined, initial_value = undefined) {
    let showButton = true;
    if (index == undefined) {
      index = this.state.values.length;
      showButton = false;
    }

    return (
      <li class="addressfield-geosuggest__item">
        <Geosuggester
          ref={el => this._geoSuggest.push(el)}
          onSuggestSelect={suggest => this.onSuggestSelect(index, suggest)}
          initialValue={initial_value}
          className="addressfield-geosuggest__input"
          name={"addressfield-geosuggest-" + index}
          autoActivateFirstSuggest={true}
          placeholder={this.props.placeholder}
          {...this.props.settings}
        />
        {showButton == true && (
          <RemoveButton
            onClick={() => {
              this.removeItem(index);
            }}
          />
        )}
      </li>
    );
  }

  render() {
    // Create a geosuggester for each item. for the onSuggestSelect event, we
    // create a arrow function which then triggers the actual event handler, so
    // the we have a reference which element was changed.
    let geosuggester = this.state.values.map((value, i) => {
      return this.renderGeoInput(i, value.data.formatted_address);
    });

    // Check for cardinality and if needed create an additional Geosuggester so
    // that a new item can be entered.
    if (this.props.settings.cardinality == -1 || this.state.values.length < this.props.settings.cardinality) {
      geosuggester.push(this.renderGeoInput());
    }

    return <ul className="addressfield-geosuggest">{geosuggester}</ul>;
  }
}

export default Geosuggest;
