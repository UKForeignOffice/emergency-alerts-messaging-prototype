
const CHANNELS = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  WHATSAPP: 'WHATSAPP',
  VIBER: 'VIBER'
}

module.exports = {
  CHANNELS,
  BEARER_TOKEN: `Bearer ${process.env.BEARER_TOKEN}`
}
