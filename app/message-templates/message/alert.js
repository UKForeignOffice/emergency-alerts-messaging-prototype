module.exports = ({ country, title, body }) => `
FCDO travel alert for ${country}

${title}

${body}

^ To unsubscribe, reply to this SMS with UNSUBSCRIBE ${country}
`;
