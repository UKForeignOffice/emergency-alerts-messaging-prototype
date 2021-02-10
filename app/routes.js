const express = require('express')
const router = express.Router()
const NotifyClient = require('notifications-node-client').NotifyClient,
  notify = new NotifyClient(process.env.NOTIFYAPIKEY);
const { updateConversation, getSubscribersForCountry, instantSubscribe } = require('./store');
const constants = require('./constants');
const vonage = require('./vonage');
const { saveToCrm, getAlerts } = require('./save-to-crm');

const slugify = str => str.toLowerCase().replace(/ /g, '-');

const BEARER_TOKEN = `Bearer ${process.env.BEARER_TOKEN}`;

const sendNotifySms = ({ data, phoneNumber }) => {
  if (data.lastCountryRequested) {
    data.countryUrlSlug = slugify(data.lastCountryRequested)
  }
  if (data.lastTemplateSent) {
    const options = {
      personalisation: data
    };
    console.log(`Notify SMS sent to ***${phoneNumber.slice(-3)}`);
    notify.sendSms(
      data.lastTemplateSent,
      phoneNumber,
      options
    )
  }
};

router.post('/broadcast-alert', (req, res) => {
  const { country, message } = req.body;
  const subscribers = getSubscribersForCountry({ country });
  subscribers.forEach(({ senderId, channel }) => {
    if (channel === constants.CHANNELS.SMS) {
      notify.sendSms(
        'baccbf59-9f54-4f69-a914-ad84e5cc181a',
        senderId,
        {
          personalisation: {
            message
          }
        }
      ).catch(err => console.log(err))
      return;
    }
    if (channel === constants.CHANNELS.EMAIL) {
      notify.sendEmail(
        '211b0b04-b04c-4289-b8b7-cf903b70f61a',
        senderId,
        {
          personalisation: {
            message,
            country
          }
        }
      ).catch(err => console.log(err))
      saveToCrm({ emailAddress: senderId, country, message, channel: constants.CHANNELS.EMAIL })
      return;
    }
    // whatsapp / viber
    vonage.sendMessage({ number: senderId, message, channel })
  });
  req.session.data['country'] = country;
  req.session.data['subscribers'] = subscribers;
  req.session.data['message'] = message;
  res.redirect('/broadcast-confirmation');
});

router.get('/alerts', async(req, res) => {
  const alerts = await getAlerts();
  res.json(alerts);
})

router.post('/vonage-received-callback', (req, res) => {
  const { number, type } = req.body.from;
  const { text } = req.body.message.content;
  const channel = type === 'whatsapp' ? constants.CHANNELS.WHATSAPP : constants.CHANNELS.VIBER;
  let data = updateConversation({ phoneNumber: number, userMessage: text, channel });
  if (data.lastCountryRequested) {
    data.countryUrlSlug = slugify(data.lastCountryRequested);
  }
  const { lastTemplateSent, ...rest } = data;
  if (lastTemplateSent) {
    console.log(`${channel} message sent to ***${number.slice(-3)}`);
    vonage.sendMessage({ number, message: lastTemplateSent(rest), channel });
  }
  const lowerCase = text.trim().toLowerCase();
  const smsSubscribeRequest = lowerCase.startsWith('sms ');
  if (smsSubscribeRequest) {
    const userMessage = lowerCase.replace('sms ', 'subscribe ');
    data = updateConversation({ phoneNumber: number, userMessage, channel: constants.CHANNELS.SMS });
    sendNotifySms({ data, phoneNumber: number });
  }
  res.sendStatus(200);
});

router.post('/vonage-status-callback', (req, res) => {
  res.sendStatus(200);
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
  sendNotifySms({ data, phoneNumber: source_number });
  res.sendStatus(200);
});

router.post('/subscriptions', (req, res) => {
  if (req.headers.authorization !== BEARER_TOKEN) {
    return res.sendStatus(403);
  }
  if (!req.body.senderId || !req.body.countries || !req.body.channel) {
    return res.sendStatus(400);
  }
  const { senderId, countries, channel } = req.body;
  instantSubscribe({ senderId, countries, channel });
  res.sendStatus(201);
});

// HTML pages

router.use(require('../lib/middleware/authentication/authentication.js'));

router.get('/', (req, res, next) => {
  req.session.data = {};
  next();
});

module.exports = router
