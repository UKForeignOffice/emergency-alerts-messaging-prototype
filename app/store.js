const recognisedCountryList = require('./data/countries.json');

const recognisedCountryNames = Object.values(recognisedCountryList).map(recognisedCountry => recognisedCountry.item[0].name).sort();

const map = {};

const blankData = {
  countries: [],
  lastCountryRequested: null,
  isBritishNational: null,
  lastTemplateSent: null
};

const TEMPLATE_IDS = {
  CONFIRM_BRITISH_NATIONAL: '9c73d816-196e-4186-bef6-12cf41235249',
  CONFIRM_SUBSCRIBED: '5e302047-fa3e-49c8-86f9-f25638bdfdad',
  DENIED_NON_BRITISH_NATIONAL: '8ce7e522-7d71-4557-a77c-20d93e9b39a2',
  COUNTRY_NOT_RECOGNISED: 'bb9821f5-b6a2-4825-9315-da164bc42d0f',
  CONFIRM_UNSUBSCRIBED: 'dbdda926-f373-4a1e-a30d-94a2dfac627b',
  LIST_SUBSCRIBED_COUNTRIES: 'ee8faa0f-5d2f-42fd-beed-0ca6ec584dba'
};

const matchCountryName = str =>
  recognisedCountryNames.find(recognisedCountry => recognisedCountry.toLowerCase() === str);

module.exports = ({phoneNumber, userMessage}) => {
  if (!map[phoneNumber]) {
    map[phoneNumber] = {...blankData, countries: []};
  }
  const message = userMessage.trim().toLowerCase();

  if (message === 'yes' && map[phoneNumber].isBritishNational === null && map[phoneNumber].lastTemplateSent === TEMPLATE_IDS.CONFIRM_BRITISH_NATIONAL && map[phoneNumber].lastCountryRequested) {
    if (!map[phoneNumber].countries.includes(map[phoneNumber].lastCountryRequested)) {
      map[phoneNumber].countries.push(map[phoneNumber].lastCountryRequested);
    }
    map[phoneNumber].isBritishNational = true;
    map[phoneNumber].lastTemplateSent = TEMPLATE_IDS.CONFIRM_SUBSCRIBED;
    return {...map[phoneNumber]};
  }

  if (message === 'no' && map[phoneNumber].isBritishNational === null && map[phoneNumber].lastTemplateSent === TEMPLATE_IDS.CONFIRM_BRITISH_NATIONAL) {
    map[phoneNumber].isBritishNational = false;
    map[phoneNumber].lastTemplateSent = TEMPLATE_IDS.DENIED_NON_BRITISH_NATIONAL;
    return {...map[phoneNumber]};
  }

  // list all subscribed countries
  if (message === 'subscribe list') {
    map[phoneNumber].lastTemplateSent = TEMPLATE_IDS.LIST_SUBSCRIBED_COUNTRIES;
    return {...map[phoneNumber], countries: map[phoneNumber].countries.length ? map[phoneNumber].countries : 'none'};
  }

  const unsubscribeRequest = message.startsWith('unsubscribe ');
  const requestedCountryName = unsubscribeRequest ? message.split(' ')[1] : message;
  const recognisedCountry = matchCountryName(requestedCountryName);
  if (recognisedCountry) {
    map[phoneNumber].lastCountryRequested = recognisedCountry;
    if (unsubscribeRequest) {
      // unsubscribe
      map[phoneNumber].countries = map[phoneNumber].countries.filter(country => country !== recognisedCountry);
      map[phoneNumber].lastTemplateSent = TEMPLATE_IDS.CONFIRM_UNSUBSCRIBED;
      return {...map[phoneNumber]};
    }
    // subscribe
    if (map[phoneNumber].isBritishNational === true) {
      if (!map[phoneNumber].countries.includes(recognisedCountry)) {
        map[phoneNumber].countries.push(recognisedCountry);
      }
      map[phoneNumber].lastTemplateSent = TEMPLATE_IDS.CONFIRM_SUBSCRIBED;
    } else if (map[phoneNumber].isBritishNational === null) {
      map[phoneNumber].lastTemplateSent = TEMPLATE_IDS.CONFIRM_BRITISH_NATIONAL;
    } else {
      map[phoneNumber].lastTemplateSent = TEMPLATE_IDS.DENIED_NON_BRITISH_NATIONAL;
    }
    return {...map[phoneNumber]};
  }

  // unrecognised country
  map[phoneNumber].lastCountryRequested = requestedCountryName;
  map[phoneNumber].lastTemplateSent = TEMPLATE_IDS.COUNTRY_NOT_RECOGNISED;
  return {...map[phoneNumber]};

  map[phoneNumber].lastTemplateSent = null;
  return {...map[phoneNumber]};
}
