# FCO emergency travel alerts - messaging prototype

https://fcdo-sms-subscriber.herokuapp.com/

A prototype for user testing, to send a test alert to all subscribers for a specified country;

See also - subscribe to emergency alerts (using https://github.com/UKForeignOffice/travel-alerts-prototype).

Note - subscriber details are stored in memory, and are wiped every time the app restarts.

## Getting started

1. Take a copy of the .env-example file in the repo root, and name it .env
2. Using the Caution Your Blast Heroku team account, copy all variables from https://dashboard.heroku.com/apps/fcdo-sms-subscriber/settings to the .env file
3. `npm i`

To run:
`npm start`

The app / service will run locally on http://localhost:3001

## Adding subscribers
Either, run the [subscriber app](https://github.com/UKForeignOffice/travel-alerts-prototype) locally, or use the [Postman collection](./postman_collection.json) to send subscription requests.

## Pages
/ - broadcast an alert / Tweet
/send-kenya - broadcast an alert (Kenya) - two pre-prepared alerts that can be broadcast in sequence to simulate an incident
/alert-history?country=Myanmar - alert history (also available for Kenya)

## Using the API locally

To use WhatsApp or Viber, register your phone number by following these [instructions](https://docs.google.com/document/d/1SakVPPP8Yt8fLPSPj4t6j5ucW6ENL6x0/edit#heading=h.du842k3jz8je).

You can use Postman to send requests to 
Load `./postman_collection.json` into Postman, to send requests to localhost.

Change the request body to subscribe, confirm British nationality etc.

## Sending an alert
Use the page at http://localhost:3001 or https://fcdo-sms-subscriber.herokuapp.com to broadcast an alert to all subscribers for the country you specify.

## Deployed service

https://fcdo-sms-subscriber.herokuapp.com/

## Heroku

https://dashboard.heroku.com/apps/fcdo-sms-subscriber

## Notify messaging - email / SMS
The Notify account name that we used for testing is "FCDO Emergency Alerts DEV".  digital.services@fco.gov.uk is one of the team members.
[Notify dashboard](https://www.notifications.service.gov.uk/services/22726d26-bf70-459e-b3c6-80cd77095472/api/keys)
Populate the Notify API key var in .env

## WhatsApp messaging
A Vonage developer account has been used to send / receive WhatsApp and Viber messages.
Set up a new developer account at https://developer.nexmo.com/getting-started/overview and populate the following vars in .env:
VONAGE_API_KEY=
VONAGE_API_SECRET=
VONAGE_APPLICATION_ID=
VONAGE_APPLICATION_PRIVATE_KEY=
VONAGE_BASE_URL=
VONAGE_WHATSAPP_NUMBER=

## Twitter
Spiked sending alert messages to Twitter (from the main send alert page).
Create a Twitter developer account and populate the following vars in .env:
TWITTER_API_KEY=
TWITTER_API_SECRET_KEY=
TWITTER_API_BEARER_TOKEN=
TWITTER_ACCESS_TOKEN_KEY=
TWITTER_ACCESS_TOKEN_SECRET=

## Dynamics
An endpoint at /alerts is a spike to save alert data to Dynamics CRM. Populate the .env vars prefixed DYNAMICS_ to authenticate.
