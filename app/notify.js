
const NotifyClient = require('notifications-node-client').NotifyClient

module.exports = new NotifyClient(process.env.NOTIFYAPIKEY)
