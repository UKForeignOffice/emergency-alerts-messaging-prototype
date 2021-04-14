module.exports = ({ country, title, body }) => `
FCDO travel alert for ${country}

${title}

${body}

All alerts for ${country}: https://fcdo-sms-subscriber.herokuapp.com/alert-history?country=${country}&sort=desc

^ To unsubscribe, go to ${process.env.SUBSCRIBE_APP_HOST}/unsubscribe}
`;
