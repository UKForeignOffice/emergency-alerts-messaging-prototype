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

const countryNames = Object.values(fullCountryList).map(country => country.item[0].name).sort();

const Myanmar = require('./alerts-myanmar')
const Kenya = require('./alerts-kenya')

module.exports = {
  countryNames,
  incidents: { Myanmar, Kenya },
  sort: 'asc'
}
