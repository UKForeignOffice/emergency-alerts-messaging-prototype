const fetch = require('node-fetch')
const dateFns = require('date-fns')

module.exports = {
  draftTravelAdvicePage: async (req, res, next) => {
    const { travelAdviceDraftCountry } = req.query
    req.session.data.draftTravelAdvice = null
    if (!travelAdviceDraftCountry) {
      next()
    }
    try {
      const res = await fetch(`${process.env.GOV_UK_CONTENT_API_TRAVEL_ADVICE}${travelAdviceDraftCountry.toLowerCase()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      if (res.ok) {
        req.session.data.draftTravelAdvice = await res.json()
      }
    } catch (err) {
      console.error(err)
    } finally {
      next()
    }
  }
}
