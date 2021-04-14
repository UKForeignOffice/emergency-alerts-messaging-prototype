module.exports = ({ senderId }) => ({
  subject: 'New in gov.uk travel advice - emergency alerts',
  body: `
You're currently subscribed to gov.uk travel advice updates for the following countries: Philippines.

As travel advice changes for the Philippines, we will continue to notify you by email.

If a travel advice update relates to an emergency occurring in the Philippines that could significantly impact the safety of British Nationals or disrupt their travel plans, for example a terrorist incident or natural disaster, the email we send you will include helpful information and advice, for example embassy contact numbers.

We can also send you these emergency travel advice updates via SMS. You'll continue to receive non-urgent travel advice updates by email only.

To manage your subscription, unsubscribe, or request emergency updates by SMS - https://fcdo-alerts-prototype.herokuapp.com/manage
`
});
