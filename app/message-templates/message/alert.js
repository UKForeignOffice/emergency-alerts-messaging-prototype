module.exports = ({ country, title, body }) => `
FCDO travel alert for ${country}

${title}

${body}

All alerts for ${country}: ${process.env.SEND_ALERT_APP_HOST}/alert-history?country=${country}&sort=desc

^ To unsubscribe, go to ${process.env.SUBSCRIBE_APP_HOST}/unsubscribe}
`;
