const recognisedCountryList = require('./data/countries.json');
const recognisedCountryNames = Object.values(recognisedCountryList).map(recognisedCountry => recognisedCountry.item[0].name).sort();
const getTemplates = require('./message-templates');

const map = {
  SMS: {},
  WHATSAPP: {}
};

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
    if (!map[channel][phoneNumber]) {
      map[channel][phoneNumber] = { ...blankData, countries: [] };
    }
    const message = userMessage.trim().toLowerCase();

    if (message === 'yes' && map[channel][phoneNumber].isBritishNational === null && map[channel][phoneNumber].lastTemplateSent === TEMPLATES.CONFIRM_BRITISH_NATIONAL && map[channel][phoneNumber].lastCountryRequested) {
      if (!map[channel][phoneNumber].countries.includes(map[channel][phoneNumber].lastCountryRequested)) {
        map[channel][phoneNumber].countries.push(map[channel][phoneNumber].lastCountryRequested);
      }
      map[channel][phoneNumber].isBritishNational = true;
      map[channel][phoneNumber].lastTemplateSent = TEMPLATES.CONFIRM_SUBSCRIBED;
      return { ...map[channel][phoneNumber] };
    }

    if (message === 'no' && map[channel][phoneNumber].isBritishNational === null && map[channel][phoneNumber].lastTemplateSent === TEMPLATES.CONFIRM_BRITISH_NATIONAL) {
      map[channel][phoneNumber].isBritishNational = false;
      map[channel][phoneNumber].lastTemplateSent = TEMPLATES.DENIED_NON_BRITISH_NATIONAL;
      return { ...map[channel][phoneNumber] };
    }

    // list all subscribed countries
    if (message === 'subscribe list') {
      map[channel][phoneNumber].lastTemplateSent = TEMPLATES.LIST_SUBSCRIBED_COUNTRIES;
      return {
        ...map[channel][phoneNumber],
        countries: map[channel][phoneNumber].countries.length ? map[channel][phoneNumber].countries : 'none'
      };
    }

    const unsubscribeRequest = message.startsWith('unsubscribe ');
    const requestedCountryName = unsubscribeRequest ? message.replace('unsubscribe ', '') : message;
    const recognisedCountry = matchCountryName(requestedCountryName);
    if (recognisedCountry) {
      map[channel][phoneNumber].lastCountryRequested = recognisedCountry;
      if (unsubscribeRequest) {
        // unsubscribe
        map[channel][phoneNumber].countries = map[channel][phoneNumber].countries.filter(country => country !== recognisedCountry);
        map[channel][phoneNumber].lastTemplateSent = TEMPLATES.CONFIRM_UNSUBSCRIBED;
        return { ...map[channel][phoneNumber] };
      }
      // subscribe
      if (map[channel][phoneNumber].isBritishNational === true) {
        if (!map[channel][phoneNumber].countries.includes(recognisedCountry)) {
          map[channel][phoneNumber].countries.push(recognisedCountry);
        }
        map[channel][phoneNumber].lastTemplateSent = TEMPLATES.CONFIRM_SUBSCRIBED;
      } else if (map[channel][phoneNumber].isBritishNational === null) {
        map[channel][phoneNumber].lastTemplateSent = TEMPLATES.CONFIRM_BRITISH_NATIONAL;
      } else {
        map[channel][phoneNumber].lastTemplateSent = TEMPLATES.DENIED_NON_BRITISH_NATIONAL;
      }
      return { ...map[channel][phoneNumber] };
    }

    // unrecognised country
    map[channel][phoneNumber].lastCountryRequested = requestedCountryName;
    map[channel][phoneNumber].lastTemplateSent = TEMPLATES.COUNTRY_NOT_RECOGNISED;
    return { ...map[channel][phoneNumber] };

    map[channel][phoneNumber].lastTemplateSent = null;
    return { ...map[channel][phoneNumber] };
  },
  getSubscribersForCountry: ({ country }) => {
    const forChannel = channel =>
      Object.keys(map[channel]).map(number =>
        map[channel][number].countries.includes(country) ? { number, channel } : null
      ).filter(Boolean);
    return [...forChannel('SMS'), ...forChannel('WHATSAPP')];
  }
}
