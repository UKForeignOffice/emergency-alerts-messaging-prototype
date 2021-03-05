const Vonage = require('@vonage/server-sdk')
const constants = require('./constants');
const { updateConversation } = require('./store')
const { slugify, prefixPhoneNumber } = require('./utils')

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
      { type, number: prefixPhoneNumber(senderId) },
      secondParam,
      {
        "content": {
          "type": "text",
          "text": message
        }
      },
      err => {
        if (err) {
          console.error(err);
          reject(err)
        } else {
          resolve({ senderId, channel });
        }
      }
    );
  });
}

const messageReceived = async (req, res) => {
  const { number, type } = req.body.from
  const { text } = req.body.message.content
  const channel = type === 'whatsapp' ? constants.CHANNELS.WHATSAPP : constants.CHANNELS.VIBER
  const data = updateConversation({ phoneNumber: number, userMessage: text, channel })
  if (data.lastCountryRequested) {
    data.countryUrlSlug = slugify(data.lastCountryRequested)
  }
  const { lastTemplateSent, renderedTemplate } = data
  if (lastTemplateSent) {
    console.log(`${channel} template "${lastTemplateSent}" sent to ***${number.slice(-3)}`)
    await sendMessage({ senderId: number, message: renderedTemplate, channel })
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
