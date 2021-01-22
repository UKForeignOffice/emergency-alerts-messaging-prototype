module.exports = ({ lastCountryRequested, countryUrlSlug }) => `
You are subscribed to UK Government alerts for ${lastCountryRequested}.

You might not always have internet access while abroad. Would you also like to us to send these alerts via SMS, to this phone number? If so reply SMS ${lastCountryRequested} to this message.
Receiving a text might incur a charge depending on the country / mobile network.

To get additional advice for travelling in ${lastCountryRequested}, visit https://www.gov.uk/foreign-travel-advice/${countryUrlSlug}

To unsubscribe, reply to this message with UNSUBSCRIBE ${lastCountryRequested}
`;
