module.exports = ({ lastCountryRequested, countryUrlSlug }) => `
You are subscribed to UK Government alerts for ${lastCountryRequested}.

To get additional advice for travelling in ${lastCountryRequested}, visit https://www.gov.uk/foreign-travel-advice/${countryUrlSlug}

To unsubscribe, reply to this message with UNSUBSCRIBE ${lastCountryRequested}
`;
