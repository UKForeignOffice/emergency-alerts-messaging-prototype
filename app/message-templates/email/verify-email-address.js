module.exports = ({ senderId, countryList, emergencyAlerts }) => ({
  subject: 'Please verify your email address',
  body: `
You’ve requested to be subscribed to FCDO travel alerts for the following countries: ${countryList}.

Click this link to verify your email address: ${process.env.SUBSCRIBE_APP_HOST}/email-verified?email=${senderId}&countryList=${encodeURIComponent(countryList)}&emergency=${emergencyAlerts}
`
});
