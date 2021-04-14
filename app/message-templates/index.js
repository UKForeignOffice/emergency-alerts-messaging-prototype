const constants = require('../constants');

const MESSAGE_TEMPLATES = {
  CONFIRM_BRITISH_NATIONAL: require('./message/confirm-british-national'),
  CONFIRM_SUBSCRIBED: require('./message/subscribe-confirmation'),
  DENIED_NON_BRITISH_NATIONAL: require('./message/not-british-national'),
  COUNTRY_NOT_RECOGNISED: require('./message/country-not-recognised'),
  CONFIRM_UNSUBSCRIBED: require('./message/unsubscribe-confirmation'),
  LIST_SUBSCRIBED_COUNTRIES: require('./message/subscription-list'),
  VERIFY_PHONE_NUMBER: require('./message/verify-phone-number')
}

const EMAIL_TEMPLATES = {
  VERIFY_EMAIL_ADDRESS: require('./email/verify-email-address'),
  REVIEW_TRAVEL_ADVICE_DRAFT: require('./email/draft-travel-advice-review'),
  ONBOARD_EXISTING_SUBSCRIBER: require('./email/onboard-existing-subscriber')
}

module.exports = ({ channel }) => {
  if (channel === constants.CHANNELS.EMAIL) {
    return EMAIL_TEMPLATES;
  }
  return MESSAGE_TEMPLATES;
}
