
module.exports = {
  alertHistory: (req, res, next) => {
    const {country} = req.query
    const { incidents } = req.session.data
    if (incidents[country]) {
      res.locals.incident = {
        ...incidents[country],
        alerts: incidents[country].alerts
          .sort((a, b) => {
            if (req.session.data.sort === 'asc') {
              return Date.parse(a.date) < Date.parse(b.date) ? -1 : 1
            }
            return Date.parse(a.date) > Date.parse(b.date) ? -1 : 1
          })
      }
    }
    next()
  }
}
