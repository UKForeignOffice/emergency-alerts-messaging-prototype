const constants = require('./constants');
const { updateConversation } = require('./store')
const { BEARER_TOKEN } = require('./constants')
const notify = require('./notify')
const { NOTIFY_TEMPLATE_ID_SMS } = require('./constants')

const sendNotifySms = async ({ data, phoneNumber }) => {
  await notify.sendSms(
    NOTIFY_TEMPLATE_ID_SMS,
    phoneNumber,
    {
      personalisation: {
        body: data.renderedTemplate
      }
    }
  )
  console.log(`Notify SMS sent to ***${phoneNumber.slice(-3)} with template ${data.lastTemplateSent}`)
}

const messageReceived = async (req, res) => {
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

  if (data.lastTemplateSent) {
    await sendNotifySms({ data, phoneNumber: source_number })
  }
  res.sendStatus(200)
}

module.exports = {
  sendNotifySms,
  messageReceived
}
