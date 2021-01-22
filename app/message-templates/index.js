const constants = require('../constants');

const NOTIFY_TEMPLATE_IDS = {
  CONFIRM_BRITISH_NATIONAL: '9c73d816-196e-4186-bef6-12cf41235249',
  CONFIRM_SUBSCRIBED: '5e302047-fa3e-49c8-86f9-f25638bdfdad',
  DENIED_NON_BRITISH_NATIONAL: '8ce7e522-7d71-4557-a77c-20d93e9b39a2',
  COUNTRY_NOT_RECOGNISED: 'bb9821f5-b6a2-4825-9315-da164bc42d0f',
  CONFIRM_UNSUBSCRIBED: 'dbdda926-f373-4a1e-a30d-94a2dfac627b',
  LIST_SUBSCRIBED_COUNTRIES: 'ee8faa0f-5d2f-42fd-beed-0ca6ec584dba'
};

const WHATSAPP_TEMPLATES = {
  CONFIRM_BRITISH_NATIONAL: require('./confirm-british-national'),
  CONFIRM_SUBSCRIBED: require('./subscribe-confirmation'),
  CONFIRM_SUBSCRIBED_SMS: require('./subscribe-confirmation-sms'),
  DENIED_NON_BRITISH_NATIONAL: require('./not-british-national'),
  COUNTRY_NOT_RECOGNISED: require('./country-not-recognised'),
  CONFIRM_UNSUBSCRIBED: require('./unsubscribe-confirmation'),
  LIST_SUBSCRIBED_COUNTRIES: require('./subscription-list')
}

module.exports = ({ channel }) => {
  if (channel === constants.CHANNELS.SMS) {
    return NOTIFY_TEMPLATE_IDS;
  }
  if (channel === constants.CHANNELS.WHATSAPP) {
    return WHATSAPP_TEMPLATES;
  }
}
