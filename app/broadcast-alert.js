const makeEmailAlert = require('./message-templates/email/alert');
const notify = require('./notify')
const { getSubscribersForCountry } = require('./store')
const constants = require('./constants')
const { slugify } = require('./utils');
const vonage = require('./vonage')
const { NOTIFY_TEMPLATE_ID_EMAIL, NOTIFY_TEMPLATE_ID_SMS } = require('./constants')
const { sendTweet } = require('./twitter')
const { incidents } = require('./data/session-data-defaults')

module.exports = async (req, res) => {
  const { country, messageHeading, messageEmail, messageSms, messageWhatsApp, messageTwitter1, messageTwitter2, messageTwitter3 } = req.body
  const subscribers = getSubscribersForCountry({ country })
  if (!incidents[country]) {
    return res.redirect('/')
  }
  incidents[country].alerts.push({
    date: (new Date()).toISOString(),
    title: messageHeading,
    email: messageEmail,
    sms: messageSms
  })

  const results = await Promise.allSettled(
    subscribers.map(({ senderId, channel }) => {
      if (channel === constants.CHANNELS.SMS) {
        return notify.sendSms(
          NOTIFY_TEMPLATE_ID_SMS,
          senderId,
          {
            personalisation: {
              body: messageSms
            }
          }
        )
      }
      if (channel === constants.CHANNELS.EMAIL) {
        const countryUrlSlug = slugify(country);
        const email = makeEmailAlert({ email: senderId, country, countryUrlSlug, body: messageEmail, messageHeading })
        return notify.sendEmail(
          NOTIFY_TEMPLATE_ID_EMAIL,
          senderId,
          {
            personalisation: {
              subject: `FCDO Travel Alert for ${country}`,
              body: email
            }
          }
        )
        // saveToCrm({ emailAddress: senderId, country, message: messageEmail, channel: constants.CHANNELS.EMAIL })
      }
      // whatsapp / viber
      if (channel === constants.CHANNELS.WHATSAPP) {
        return vonage.sendMessage({ senderId, message: messageWhatsApp, channel })
      }
    })
  );
  await sendTweet({ messages: [messageTwitter1, messageTwitter2, messageTwitter3] })
  req.session.data['country'] = country
  req.session.data['succeeded'] = [];
  req.session.data['failed'] = [];
  results.forEach((result, idx) => {
    if (result.status === 'fulfilled') {
      req.session.data['succeeded'].push(subscribers[idx]);
    } else {
      req.session.data['failed'].push(subscribers[idx]);
      console.error(result.reason.message)
    }
  })
  res.redirect('/broadcast-confirmation')
}
