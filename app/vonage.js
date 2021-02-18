const Vonage = require('@vonage/server-sdk')
const constants = require('./constants');

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

module.exports = {
  sendMessage
}
