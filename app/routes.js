const express = require('express')
const router = express.Router()
const vonage = require('./vonage')
const crm = require('./save-to-crm')
const broadcastAlert = require('./broadcast-alert')
const sms = require('./sms')
const { alertHistory } = require('./alert-history')
const { addSubscription } = require('./add-subscription')

router.get('/alert-history', alertHistory)

router.post('/broadcast-alert', broadcastAlert)

router.get('/alerts', crm.getAlerts)

router.post('/vonage-received-callback', vonage.messageReceived)

// allows you to receive message status updates (e.g. delivered, seen)
router.post('/vonage-status-callback', vonage.statusCallback)

router.post('/sms-received-callback', sms.messageReceived)

router.post('/subscriptions', addSubscription)

// HTML pages

router.use(require('../lib/middleware/authentication/authentication.js'))

// reset all session data if user hits index page
router.get('/', (req, res, next) => {
  req.session.data = {}
  next()
})

module.exports = router
