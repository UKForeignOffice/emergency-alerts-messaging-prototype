/*

Provide default values for user session data. These are automatically added
via the `autoStoreData` middleware. Values will only be added to the
session if a value doesn't already exist. This may be useful for testing
journeys where users are returning or logging in to an existing application.

============================================================================

Example usage:

"full-name": "Sarah Philips",

"options-chosen": [ "foo", "bar" ]

============================================================================

*/

const fullCountryList = require('./countries.json');

const fullCountryNames = Object.values(fullCountryList).map(country => country.item[0].name).sort();

module.exports = {
  fullCountryNames,
  availableCountries: fullCountryNames,
  countries: []
}
