module.exports = ({ email, country, countryUrlSlug, messageHeading, body }) => `

# ${messageHeading}

${body}

To view all alerts sent for ${country}, please visit ${process.env.SEND_ALERT_APP_HOST}/alert-history?country=${country}&sort=desc

The British Embassy is following the situation carefully and will continue to update the Travel Advice - https://www.gov.uk/foreign-travel-advice/${countryUrlSlug} 
    
^ To unsubscribe, go to ${process.env.SUBSCRIBE_APP_HOST}/unsubscribe-email?unsubscribeEmail=${email}&unsubscribeCountry=${encodeURIComponent(country)}
`;
