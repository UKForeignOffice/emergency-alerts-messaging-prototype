
const dateFns = require('date-fns')

module.exports = {
  alertHistory: (req, res, next) => {
    req.session.data.incident.alerts = req.session.data.incident.alerts
      .map(alert => ({
        ...alert,
        dateShort: dateFns.format(new Date(alert.date), 'do MMM, HH:mm')
      }))
      .sort((a, b) => {
        if (req.session.data.sort === 'asc') {
          return Date.parse(a.date) < Date.parse(b.date) ? -1 : 1
        }
        return Date.parse(a.date) > Date.parse(b.date) ? -1 : 1
      })
    next()
  }
}
