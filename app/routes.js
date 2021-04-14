const express = require('express')
const router = express.Router()
const vonage = require('./vonage')
const crm = require('./save-to-crm')
const broadcastAlert = require('./broadcast-alert')
const sms = require('./sms')
const { alertHistory } = require('./alert-history')
const { addSubscription, getSubscriptions } = require('./subscriptions')
const confirmSenderId = require('./confirm-sender-id')
const onboardExistingSubscriber = require('./onboard-existing-subscriber')
const { draftTravelAdvicePage, draftTravelAdvicePageSendToReviewer } = require('./draft-travel-advice')

router.post('/broadcast-alert', broadcastAlert)

router.get('/alerts', crm.getAlerts)

router.post('/vonage-received-callback', vonage.messageReceived)

// allows you to receive message status updates (e.g. delivered, seen)
router.post('/vonage-status-callback', vonage.statusCallback)

router.post('/sms-received-callback', sms.messageReceived)

router.post('/subscriptions', addSubscription)
router.get('/subscriptions', getSubscriptions)

router.post('/confirm-sender-id', confirmSenderId)

router.post('/onboard-existing-subscriber', onboardExistingSubscriber)

router.use(require('../lib/middleware/authentication/authentication.js'))

router.get('/draft-travel-advice', draftTravelAdvicePage)
router.post('/draft-travel-advice-send-to-reviewer', draftTravelAdvicePageSendToReviewer)
router.get('/alert-history', alertHistory)

// reset all session data if user hits index page
router.get('/', (req, res, next) => {
  req.session.data = {}
  next()
})

module.exports = router
