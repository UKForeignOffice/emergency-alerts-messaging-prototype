const recognisedCountryList = require('./data/countries.json');
const recognisedCountryNames = Object.values(recognisedCountryList).map(recognisedCountry => recognisedCountry.item[0].name).sort();
const getTemplates = require('./message-templates');
const constants = require('./constants');
const { slugify, prefixPhoneNumber } = require('./utils');

const map = {
  EMAIL: {},
  SMS: {},
  WHATSAPP: {},
  VIBER: {}
};

const blankData = {
  countries: [],
  lastCountryRequested: null,
  isBritishNational: null,
  lastTemplateSent: null
};

const matchCountryName = str =>
  recognisedCountryNames.find(recognisedCountry => recognisedCountry.toLowerCase() === str);

const updateData = ({ phoneNumber, userMessage, channel }) => {
  const number = prefixPhoneNumber(phoneNumber)
  if (!map[channel][number]) {
    map[channel][number] = { ...blankData, countries: [] };
  }
  const message = userMessage.trim().toLowerCase();

  if (message === 'yes' && map[channel][number].isBritishNational === null && map[channel][number].lastTemplateSent === 'CONFIRM_BRITISH_NATIONAL' && map[channel][number].lastCountryRequested) {
    if (!map[channel][number].countries.includes(map[channel][number].lastCountryRequested)) {
      map[channel][number].countries.push(map[channel][number].lastCountryRequested);
    }
    map[channel][number].isBritishNational = true;
    map[channel][number].lastTemplateSent = 'CONFIRM_SUBSCRIBED';
    return;
  }

  if (message === 'no' && map[channel][number].isBritishNational === null && map[channel][number].lastTemplateSent === 'CONFIRM_BRITISH_NATIONAL') {
    map[channel][number].isBritishNational = false;
    map[channel][number].lastTemplateSent = 'DENIED_NON_BRITISH_NATIONAL';
    return;
  }

  // list all subscribed countries
  if (message === 'subscribe list') {
    map[channel][number].lastTemplateSent = 'LIST_SUBSCRIBED_COUNTRIES';
    return;
  }
  const subscribeRequest = message.startsWith('subscribe ');
  const unsubscribeRequest = message.startsWith('unsubscribe ');
  if (subscribeRequest || unsubscribeRequest) {
    let requestedCountryName;
    if (subscribeRequest) {
      requestedCountryName = message.replace('subscribe ', '');
    }
    if (unsubscribeRequest) {
      requestedCountryName = message.replace('unsubscribe ', '');
    }
    const recognisedCountry = matchCountryName(requestedCountryName);
    if (recognisedCountry) {
      map[channel][number].lastCountryRequested = recognisedCountry;
      if (unsubscribeRequest) {
        map[channel][number].countries = map[channel][number].countries.filter(country => country !== recognisedCountry);
        map[channel][number].lastTemplateSent = 'CONFIRM_UNSUBSCRIBED';
        return;
      }
      // subscribe
      if (subscribeRequest) {
        if (map[channel][number].isBritishNational === true) {
          if (!map[channel][number].countries.includes(recognisedCountry)) {
            map[channel][number].countries.push(recognisedCountry);
          }
          map[channel][number].lastTemplateSent = 'CONFIRM_SUBSCRIBED';
        } else if (map[channel][number].isBritishNational === null) {
          map[channel][number].lastTemplateSent = 'CONFIRM_BRITISH_NATIONAL';
        } else {
          map[channel][number].lastTemplateSent = 'DENIED_NON_BRITISH_NATIONAL';
        }
      }
      return;
    }

    // unrecognised country
    map[channel][number].lastCountryRequested = requestedCountryName;
    map[channel][number].lastTemplateSent = 'COUNTRY_NOT_RECOGNISED';
    return;
  }

  map[channel][number].lastTemplateSent = null;
}
module.exports = {
  instantSubscribe: ({ senderId, countries, channel }) => {
    map[channel][senderId] = map[channel][senderId] || {...blankData, isBritishNational: true};
    map[channel][senderId].countries = Array.from(new Set([...map[channel][senderId].countries, ...countries]));
  },
  updateConversation: ({ phoneNumber, userMessage, channel }) => {
    updateData({ phoneNumber, userMessage, channel });
    if (map[channel][phoneNumber].lastCountryRequested) {
      map[channel][phoneNumber].countryUrlSlug = slugify(map[channel][phoneNumber].lastCountryRequested)
    }
    const templates = getTemplates({ channel });
    const templateId = map[channel][phoneNumber].lastTemplateSent;
    const renderedTemplate = templateId && templates[templateId](map[channel][phoneNumber])
    return { ...map[channel][phoneNumber], renderedTemplate }
  },
  getSubscribersForCountry: ({ country }) => {
    const forChannel = channel =>
      Object.keys(map[channel]).map(senderId =>
        map[channel][senderId].countries.includes(country) ? { senderId, channel } : null
      ).filter(Boolean);
    return Object
      .values(constants.CHANNELS)
      .reduce((subscribers, channel) =>
        [...subscribers, ...forChannel(channel)], [])
  }
}
