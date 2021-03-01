const notify = require('./notify')
const getTemplates = require('./message-templates')
const { NOTIFY_TEMPLATE_ID_EMAIL, NOTIFY_TEMPLATE_ID_SMS } = require('./constants')
const { instantSubscribe } = require('./store')
const { sendMessage } = require('./vonage')

module.exports = async (req, res) => {
  const { senderId, countries, channel, userRequestedEmergencyAlerts } = req.body

  if (!senderId || !countries || !channel) {
    return res.sendStatus(400)
  }

  try {
    const templateParams = {
      senderId,
      countries,
      countryList: countries.join(','),
      emergencyAlerts: userRequestedEmergencyAlerts
    }
    const templates = getTemplates({ channel })

    if (channel === 'EMAIL') {
      const { subject, body } = templates.VERIFY_EMAIL_ADDRESS(templateParams)
      await notify.sendEmail(
        NOTIFY_TEMPLATE_ID_EMAIL,
        senderId,
        {
          personalisation: {
            subject,
            body
          }
        }
      )
    }
    if (channel === 'SMS') {
      const body = templates.VERIFY_PHONE_NUMBER(templateParams)
      await notify.sendSms(
        NOTIFY_TEMPLATE_ID_SMS,
        senderId,
        {
          personalisation: {
            body
          }
        }
      )
      // later - make subscription pending until user replies with 'CONFIRM'
      instantSubscribe({ senderId, countries, channel })
    }
    if (channel === 'WHATSAPP') {
      const message = templates.VERIFY_PHONE_NUMBER(templateParams)
      await sendMessage({ senderId, message, channel })
      // later - make subscription pending until user replies with 'CONFIRM'
      instantSubscribe({ senderId, countries, channel })
    }
  } catch (err) {
    return res.sendStatus(500)
  }
  res.sendStatus(200)
}
