const makeEmailMessage = require('./message-templates/alerts/email');
const notify = require('./notify')
const { getSubscribersForCountry } = require('./store')
const constants = require('./constants')
const { slugify } = require('./utils');
const vonage = require('./vonage')

module.exports = async (req, res) => {
  const { country, messageHeading, messageEmail, messageSms } = req.body
  const subscribers = getSubscribersForCountry({ country })

  req.session.data.incident.alerts.push({
    date: (new Date()).toISOString(),
    title: messageHeading,
    email: messageEmail,
    sms: messageSms
  })

  const results = await Promise.allSettled(
    subscribers.map(({ senderId, channel }) => {
      if (channel === constants.CHANNELS.SMS) {
        return notify.sendSms(
          'baccbf59-9f54-4f69-a914-ad84e5cc181a',
          senderId,
          {
            personalisation: {
              message: messageSms
            }
          }
        )
      }
      if (channel === constants.CHANNELS.EMAIL) {
        const countryUrlSlug = slugify(country);
        const email = makeEmailMessage({ countryUrlSlug, body: messageEmail, title: messageHeading })
        return notify.sendEmail(
          '211b0b04-b04c-4289-b8b7-cf903b70f61a',
          senderId,
          {
            personalisation: {
              message: email,
              country
            }
          }
        )
        // saveToCrm({ emailAddress: senderId, country, message: messageEmail, channel: constants.CHANNELS.EMAIL })
      }
      // whatsapp / viber
      return vonage.sendMessage({ senderId, message: messageSms, channel })
    })
  );
  req.session.data['country'] = country
  req.session.data['succeeded'] = [];
  req.session.data['failed'] = [];
  results.forEach((result, idx) => {
    if (result.status === 'fulfilled') {
      req.session.data['succeeded'].push(subscribers[idx]);
    } else {
      req.session.data['failed'].push(subscribers[idx]);
    }
  })
  res.redirect('/broadcast-confirmation')
}
