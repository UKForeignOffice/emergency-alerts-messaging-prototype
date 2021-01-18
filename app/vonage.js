const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
  applicationId: process.env.VONAGE_APPLICATION_ID,
  privateKey: process.env.VONAGE_APPLICATION_PRIVATE_KEY
}, {
  apiHost: process.env.VONAGE_BASE_URL
})

const sendMessage = ({ number, message }) => {
  vonage.channel.send(
    { "type": "whatsapp", "number": number },
    { "type": "whatsapp", "number": process.env.VONAGE_WHATSAPP_NUMBER },
    {
      "content": {
        "type": "text",
        "text": message
      }
    },
    (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(data.message_uuid);
      }
    }
  );
}

module.exports = {
  sendMessage
}
