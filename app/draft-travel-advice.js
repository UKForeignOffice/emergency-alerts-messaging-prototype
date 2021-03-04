const fetch = require('node-fetch')
const notify = require('./notify')
const getTemplates = require('./message-templates')
const constants = require('./constants')

module.exports = {
  draftTravelAdvicePageSendToReviewer: async (req, res, next) => {
    const templates = getTemplates({ channel: constants.CHANNELS.EMAIL })
    const { emailAddress, travelAdviceDraftCountry } = req.session.data
    const { subject, body } = templates.REVIEW_TRAVEL_ADVICE_DRAFT({ country: travelAdviceDraftCountry, reviewer: emailAddress })
    await notify.sendEmail(
      constants.NOTIFY_TEMPLATE_ID_EMAIL,
      emailAddress,
      {
        personalisation: {
          subject,
          body
        }
      }
    )
    res.redirect(`/draft-travel-advice?travelAdviceDraftCountry=${travelAdviceDraftCountry}`)
  },
  draftTravelAdvicePage: async (req, res, next) => {
    const { travelAdviceDraftCountry, reviewer } = req.query
    res.locals.draftTravelAdvice = null
    if (reviewer) {
      res.locals.reviewer = reviewer
    }
    if (!travelAdviceDraftCountry) {
      next()
    }
    try {
      const response = await fetch(`${process.env.GOV_UK_CONTENT_API_TRAVEL_ADVICE}${travelAdviceDraftCountry.toLowerCase()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      if (response.ok) {
        res.locals.draftTravelAdvice = await response.json()
      }
    } catch (err) {
      console.error(err)
    } finally {
      next()
    }
  }
}
