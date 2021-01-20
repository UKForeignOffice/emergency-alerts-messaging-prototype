const express = require('express')
const router = express.Router()
const NotifyClient = require('notifications-node-client').NotifyClient,
  notify = new NotifyClient(process.env.NOTIFYAPIKEY);
const { updateConversation, getSubscribersForCountry } = require('./store');
const constants = require('./constants');
const vonage = require('./vonage');

const slugify = str => str.toLowerCase().replace(/ /g, '-');

const BEARER_TOKEN = 'Bearer 0123456789';

router.get('/', (req, res, next) => {
  req.session.data = {};
  next();
});

router.post('/broadcast-alert', (req, res) => {
  const { country, message } = req.body;
  const subscribers = getSubscribersForCountry({ country });
  subscribers.forEach(({ number, channel }) => {
    if (channel === constants.CHANNELS.SMS) {
      notify.sendSms(
        'baccbf59-9f54-4f69-a914-ad84e5cc181a',
        number,
        {
          personalisation: {
            message
          }
        }
      )
      return;
    }
    if (channel === constants.CHANNELS.WHATSAPP) {
      vonage.sendMessage({ number, message })
    }
  });
  req.session.data['country'] = country;
  req.session.data['subscribers'] = subscribers;
  req.session.data['message'] = message;
  res.redirect('/broadcast-confirmation');
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
