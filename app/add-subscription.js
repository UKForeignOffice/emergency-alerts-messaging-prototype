
const { instantSubscribe } = require('./store')
const { BEARER_TOKEN } = require('./constants')

module.exports = {
  addSubscription: (req, res) => {
    if (req.headers.authorization !== BEARER_TOKEN) {
      return res.sendStatus(403)
    }
    if (!req.body.senderId || !req.body.countries || !req.body.channel) {
      return res.sendStatus(400)
    }
    const { senderId, countries, channel } = req.body
    instantSubscribe({ senderId, countries, channel })
    res.sendStatus(201)
  }
}
