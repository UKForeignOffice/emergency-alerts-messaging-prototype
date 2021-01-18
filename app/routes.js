const express = require('express')
const router = express.Router()
const NotifyClient = require('notifications-node-client').NotifyClient,
  notify = new NotifyClient(process.env.NOTIFYAPIKEY);
const updateConversation = require('./store');

const slugify = str => str.toLowerCase().replace(/ /g, '-');

const BEARER_TOKEN = 'Bearer 0123456789';

router.post('/sms-received-callback', (req, res) => {
  if (req.headers.authorization !== BEARER_TOKEN) {
    return res.send(403);
  }
  if (!req.body.message || !req.body.source_number) {
    return res.send(400);
  }
  const { message, source_number } = req.body;
  const data = updateConversation({ phoneNumber: source_number, userMessage: message });
  if (data.lastCountryRequested) {
    data.countryUrlSlug = slugify(data.lastCountryRequested)
  }
  if (data.lastTemplateSent) {
    const options = {
      personalisation: data
    };
    notify.sendSms(
      data.lastTemplateSent,
      source_number,
      options
    )
  }
  res.send(200);
});

module.exports = router
