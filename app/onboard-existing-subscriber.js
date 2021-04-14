const notify = require('./notify')
const getTemplates = require('./message-templates')
const { NOTIFY_TEMPLATE_ID_EMAIL } = require('./constants')
const constants = require('./constants')

module.exports = async (req, res) => {
  const { senderId, countries } = req.body

  if (!senderId || !countries) {
    return res.sendStatus(400)
  }

  try {
    const templateParams = {
      senderId,
      countries,
      countryList: countries.join(',')
    }
    const templates = getTemplates({ channel: constants.CHANNELS.EMAIL })

    const { subject, body } = templates.ONBOARD_EXISTING_SUBSCRIBER(templateParams)
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
  } catch (err) {
    console.error(err)
    return res.sendStatus(500)
  }
  res.sendStatus(200)
}
