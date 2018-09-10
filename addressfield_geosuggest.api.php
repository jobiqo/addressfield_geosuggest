<?php

/**
 * @file
 * Hook documentation for the addressfield_geosuggest module.
 */

/**
 * Allows to alter the values passed to the address field.
 *
 * It is also possible to add further validations.
 *
 * @param array $values
 *   The values array that will be set for the addressfield.
 * @param array $context
 *   The array containing the 'element', 'form_state' and 'form' values.
 */
function hook_addressfield_geosuggest_transform_value_alter(array &$values, array $context) {
  foreach ($values as &$value) {
    $data = unserialize($value['data']);
    if ($data['formatted address'] == 'Berlin, Germany') {
      form_set_error($context['element'], t('Please choose a different location.'));
      return;
    }
  }
}
