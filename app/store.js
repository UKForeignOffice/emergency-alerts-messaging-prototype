const recognisedCountryList = require('./data/countries.json');
const recognisedCountryNames = Object.values(recognisedCountryList).map(recognisedCountry => recognisedCountry.item[0].name).sort();
const getTemplates = require('./message-templates');

const map = {};

const blankData = {
  countries: [],
  lastCountryRequested: null,
  isBritishNational: null,
  lastTemplateSent: null
};

const matchCountryName = str =>
  recognisedCountryNames.find(recognisedCountry => recognisedCountry.toLowerCase() === str);

module.exports = {
  updateConversation: ({ phoneNumber, userMessage, channel }) => {
    const TEMPLATES = getTemplates({ channel });
    if (!map[phoneNumber]) {
      map[phoneNumber] = { ...blankData, countries: [] };
    }
    const message = userMessage.trim().toLowerCase();

    if (message === 'yes' && map[phoneNumber].isBritishNational === null && map[phoneNumber].lastTemplateSent === TEMPLATES.CONFIRM_BRITISH_NATIONAL && map[phoneNumber].lastCountryRequested) {
      if (!map[phoneNumber].countries.includes(map[phoneNumber].lastCountryRequested)) {
        map[phoneNumber].countries.push(map[phoneNumber].lastCountryRequested);
      }
      map[phoneNumber].isBritishNational = true;
      map[phoneNumber].lastTemplateSent = TEMPLATES.CONFIRM_SUBSCRIBED;
      return { ...map[phoneNumber] };
    }

    if (message === 'no' && map[phoneNumber].isBritishNational === null && map[phoneNumber].lastTemplateSent === TEMPLATES.CONFIRM_BRITISH_NATIONAL) {
      map[phoneNumber].isBritishNational = false;
      map[phoneNumber].lastTemplateSent = TEMPLATES.DENIED_NON_BRITISH_NATIONAL;
      return { ...map[phoneNumber] };
    }

    // list all subscribed countries
    if (message === 'subscribe list') {
      map[phoneNumber].lastTemplateSent = TEMPLATES.LIST_SUBSCRIBED_COUNTRIES;
      return {
        ...map[phoneNumber],
        countries: map[phoneNumber].countries.length ? map[phoneNumber].countries : 'none'
      };
    }

    const unsubscribeRequest = message.startsWith('unsubscribe ');
    const requestedCountryName = unsubscribeRequest ? message.split(' ')[1] : message;
    const recognisedCountry = matchCountryName(requestedCountryName);
    if (recognisedCountry) {
      map[phoneNumber].lastCountryRequested = recognisedCountry;
      if (unsubscribeRequest) {
        // unsubscribe
        map[phoneNumber].countries = map[phoneNumber].countries.filter(country => country !== recognisedCountry);
        map[phoneNumber].lastTemplateSent = TEMPLATES.CONFIRM_UNSUBSCRIBED;
        return { ...map[phoneNumber] };
      }
      // subscribe
      if (map[phoneNumber].isBritishNational === true) {
        if (!map[phoneNumber].countries.includes(recognisedCountry)) {
          map[phoneNumber].countries.push(recognisedCountry);
        }
        map[phoneNumber].lastTemplateSent = TEMPLATES.CONFIRM_SUBSCRIBED;
      } else if (map[phoneNumber].isBritishNational === null) {
        map[phoneNumber].lastTemplateSent = TEMPLATES.CONFIRM_BRITISH_NATIONAL;
      } else {
        map[phoneNumber].lastTemplateSent = TEMPLATES.DENIED_NON_BRITISH_NATIONAL;
      }
      return { ...map[phoneNumber] };
    }

    // unrecognised country
    map[phoneNumber].lastCountryRequested = requestedCountryName;
    map[phoneNumber].lastTemplateSent = TEMPLATES.COUNTRY_NOT_RECOGNISED;
    return { ...map[phoneNumber] };

    map[phoneNumber].lastTemplateSent = null;
    return { ...map[phoneNumber] };
  }
}
