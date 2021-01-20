const express = require('express')
const router = express.Router()
const NotifyClient = require('notifications-node-client').NotifyClient,
  notify = new NotifyClient(process.env.NOTIFYAPIKEY);
const { updateConversation } = require('./store');
const constants = require('./constants');
const vonage = require('./vonage');

const slugify = str => str.toLowerCase().replace(/ /g, '-');

const BEARER_TOKEN = 'Bearer 0123456789';

router.post('/vonage-send-message', (req, res) => {
  const { number, message } = req.body;
  vonage.sendMessage({ number, message });
  res.send(200);
});

router.post('/vonage-received-callback', (req, res) => {
  const { number } = req.body.from;
  const { text } = req.body.message.content;
  const data = updateConversation({ phoneNumber: number, userMessage: text, channel: constants.CHANNELS.WHATSAPP });
  if (data.lastCountryRequested) {
    data.countryUrlSlug = slugify(data.lastCountryRequested)
  }
  const { lastTemplateSent, ...rest } = data;
  if (lastTemplateSent) {
    vonage.sendMessage({ number, message: lastTemplateSent(rest) });
  }
  res.sendStatus(200);
});

router.post('/vonage-status-callback', (req, res) => {

});

router.post('/sms-received-callback', (req, res) => {
  if (req.headers.authorization !== BEARER_TOKEN) {
    return res.sendStatus(403);
  }
  if (!req.body.message || !req.body.source_number) {
    return res.sendStatus(400);
  }
  const { message, source_number } = req.body;
  const data = updateConversation({ phoneNumber: source_number, userMessage: message, channel: constants.CHANNELS.SMS });
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
  res.sendStatus(200);
});

module.exports = router
