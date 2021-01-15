const express = require('express')
const router = express.Router()
const NotifyClient = require('notifications-node-client').NotifyClient,
  notify = new NotifyClient(process.env.NOTIFYAPIKEY);

router.post('/sms-received-callback', (req, res) => {
  console.log(req)
});

module.exports = router
