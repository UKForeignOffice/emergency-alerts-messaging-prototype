const constants = require('./constants');
const { updateConversation } = require('./store')
const { slugify } = require('./utils');
const { BEARER_TOKEN } = require('./constants')
const notify = require('./notify')

const sendNotifySms = ({ data, phoneNumber }) => {
  if (data.lastCountryRequested) {
    data.countryUrlSlug = slugify(data.lastCountryRequested)
  }
  if (data.lastTemplateSent) {
    const options = {
      personalisation: data
    }
    console.log(`Notify SMS sent to ***${phoneNumber.slice(-3)}`)
    notify.sendSms(
      data.lastTemplateSent,
      phoneNumber,
      options
    )
  }
}

const messageReceived = (req, res) => {
  if (req.headers.authorization !== BEARER_TOKEN) {
    return res.sendStatus(403)
  }
  if (!req.body.message || !req.body.source_number) {
    return res.sendStatus(400)
  }
  const { message, source_number } = req.body
  const data = updateConversation({
    phoneNumber: source_number,
    userMessage: message,
    channel: constants.CHANNELS.SMS
  })
  sendNotifySms({ data, phoneNumber: source_number })
  res.sendStatus(200)
}

module.exports = {
  sendNotifySms,
  messageReceived
}
