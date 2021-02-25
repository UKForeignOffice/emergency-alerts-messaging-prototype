const Vonage = require('@vonage/server-sdk')
const constants = require('./constants');
const { updateConversation } = require('./store')
const { sendNotifySms } = require('./sms')

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
  applicationId: process.env.VONAGE_APPLICATION_ID,
  privateKey: process.env.VONAGE_APPLICATION_PRIVATE_KEY
}, {
  apiHost: process.env.VONAGE_BASE_URL
})

const sendMessage = ({ senderId, message, channel }) => {
  const type = channel === constants.CHANNELS.WHATSAPP ? 'whatsapp' : 'viber_service_msg';
  const secondParam = channel === constants.CHANNELS.WHATSAPP ? { type, number: process.env.VONAGE_WHATSAPP_NUMBER } :
    { type: "viber_service_msg", id: process.env.VIBER_SERVICE_MESSAGE_ID };
  return new Promise((resolve, reject) => {
    vonage.channel.send(
      { type, number: senderId },
      secondParam,
      {
        "content": {
          "type": "text",
          "text": message
        }
      },
      (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve({ senderId, channel });
        }
      }
    );
  });
}

const messageReceived = (req, res) => {
  const { number, type } = req.body.from
  const { text } = req.body.message.content
  const channel = type === 'whatsapp' ? constants.CHANNELS.WHATSAPP : constants.CHANNELS.VIBER
  let data = updateConversation({ phoneNumber: number, userMessage: text, channel })
  if (data.lastCountryRequested) {
    data.countryUrlSlug = slugify(data.lastCountryRequested)
  }
  const { lastTemplateSent, ...rest } = data
  if (lastTemplateSent) {
    console.log(`${channel} message sent to ***${number.slice(-3)}`)
    vonage.sendMessage({ number, message: lastTemplateSent(rest), channel })
  }
  const lowerCase = text.trim().toLowerCase()
  const smsSubscribeRequest = lowerCase.startsWith('sms ')
  if (smsSubscribeRequest) {
    const userMessage = lowerCase.replace('sms ', 'subscribe ')
    data = updateConversation({ phoneNumber: number, userMessage, channel: constants.CHANNELS.SMS })
    sendNotifySms({ data, phoneNumber: number })
  }
  res.sendStatus(200)
};

const statusCallback = (req, res) => {
  res.sendStatus(200)
};

module.exports = {
  sendMessage,
  messageReceived,
  statusCallback
}
