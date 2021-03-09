module.exports = ({ email, country, countryUrlSlug, messageHeading, body }) => `

# ${messageHeading}

${body}

This emergency incident in Myanmar began on 1st Feb 2021. To view all alerts sent, please visit https://fcdo-sms-subscriber.herokuapp.com/alert-history?sort=desc

The British Embassy is following the situation carefully and will continue to update the Travel Advice - https://www.gov.uk/foreign-travel-advice/${countryUrlSlug} 
    
^ To unsubscribe, go to ${process.env.SUBSCRIBE_APP_HOST}/unsubscribe-email?unsubscribeEmail=${email}&unsubscribeCountry=${encodeURIComponent(country)}
`;
