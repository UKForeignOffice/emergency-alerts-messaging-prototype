# FCO emergency travel alerts - messaging prototype

https://fcdo-sms-subscriber.herokuapp.com/

A prototype for user testing, which lets users subscribe to emergency alerts. We can then send a test alert to all subscribers for a specified country.

Note - subscriber details are stored in memory, and are wiped every time the app restarts.

## Getting started

1. Copy all variables from https://dashboard.heroku.com/apps/fcdo-sms-subscriber/settings to a .env file in the root of this repo.
2. `npm i`

To run:
`npm start`

The app / service will run locally on http://localhost:3000

## Using the API locally

To use WhatsApp, register your phone number by following these [instructions](https://docs.google.com/document/d/1SakVPPP8Yt8fLPSPj4t6j5ucW6ENL6x0/edit#heading=h.du842k3jz8je).

You can use Postman to send requests to 
Load `./postman_collection.json` into Postman, to send requests to localhost.

Change the request body to subscribe, confirm British nationality etc.

## Sending an alert
Use the page at http://localhost:3000 or https://fcdo-sms-subscriber.herokuapp.com to broadcast an alert to all subscribers for the country you specify.

## Deployed app / service

https://fcdo-sms-subscriber.herokuapp.com/

## Heroku

https://dashboard.heroku.com/apps/fcdo-sms-subscriber
