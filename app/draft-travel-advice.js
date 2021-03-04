const fetch = require('node-fetch')

module.exports = {
  draftTravelAdvicePage: async (req, res, next) => {
    const { travelAdviceDraftCountry } = req.query
    res.locals.draftTravelAdvice = null
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
