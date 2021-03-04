module.exports = ({ country, reviewer }) => ({
  subject: `${country} travel advice - draft for review`,
  body: `
Approval has been requested for a draft travel advice update for ${country}.

View the draft: ${process.env.SEND_ALERT_APP_HOST}/draft-travel-advice?travelAdviceDraftCountry=${country}&reviewer=${encodeURIComponent(reviewer)}
`
});
