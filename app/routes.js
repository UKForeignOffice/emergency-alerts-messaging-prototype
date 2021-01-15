const express = require('express')
const router = express.Router()
const NotifyClient = require('notifications-node-client').NotifyClient,
  notify = new NotifyClient(process.env.NOTIFYAPIKEY);

router.post('/is-british-national', (req, res) => {
  if (req.session.data['is-british-national'] === 'yes') {
    return res.redirect('/country');
  }
  res.redirect('/not-british-national');
});



router.post('/is-check-your-answers', (req, res) => {
  const { emailaddresses = [], emailaddressToAdd } = req.session.data;
  if(emailaddressToAdd != '') {
    if (!emailaddresses.includes(emailaddressToAdd)) {
      req.session.data.emailaddresses = [...emailaddresses, emailaddressToAdd].sort();
    }
    res.redirect('/friends-and-family');
  } else {
    if (req.session.data['invite'] === 'yes') {
      return res.redirect('/check-your-answers');
    } else {
      req.session.data.emailaddresses = []
      return res.redirect('/check-your-answers');
    }
  }
});

router.use('/remove_emailaddress', (req, res) => {
  const { emailaddresses = [] } = req.session.data;
  let itemsToBeRemoved = req.query.email
  var filteredArray = emailaddresses.filter(item => !itemsToBeRemoved.includes(item))
  req.session.data.emailaddresses = filteredArray
  res.redirect('/friends-and-family');
});

router.use('/add_emailaddress', (req, res) => {
  const { emailaddresses = [], emailaddressToAdd } = req.session.data;
  if (!emailaddresses.includes(emailaddressToAdd)) {
    req.session.data.emailaddresses = [...emailaddresses, emailaddressToAdd].sort();
  }
  res.redirect('/friends-and-family');
});

router.use('/add_country', (req, res) => {
  const { countries = [], countryToAdd, fullCountryNames } = req.session.data;
  if (!countries.includes(countryToAdd)) {
    req.session.data.countries = [...countries, countryToAdd].sort();
  }
  req.session.data.availableCountries = fullCountryNames.filter(country => !req.session.data.countries.includes(country));
  if (req.query.countryToAdd) {
    return res.redirect('/intro');
  }
  res.redirect('/country');
});

router.post('/confirmation', (req, res) => {
  const { emailAddress, phoneNumber } = req.session.data;
  const options = {
    personalisation: {
      'countries': req.session.data.countries
    }
  };

  if (emailAddress) {
    notify.sendEmail(
      // this long string is the template ID, copy it from the template
      // page in GOV.UK Notify. It’s not a secret so it’s fine to put it
      // in your code.
      '349ec5ea-b7b5-4401-8a6e-3293aef13818',
      // `emailAddress` here needs to match the name of the form field in
      // your HTML page
      emailAddress,
      options
    );
  }
  if (phoneNumber) {
    notify.sendSms(
      'f8ff65b3-d33b-4649-bfe4-f19500f25c4a',
      phoneNumber,
      options
    )
  }

  // This is the URL the users will be redirected to once the email
  // has been sent
  res.redirect('/confirmation');
});

router.post('/sms_send_free_text', (req, res) => {
  const { message, phoneNumber } = req.session.data;
  const options = {
    personalisation: {
      'countries': ['Spain'],
      message
    }
  };
  notify.sendSms(
    'baccbf59-9f54-4f69-a914-ad84e5cc181a',
    phoneNumber,
    options
  )
  res.redirect('/sms_2');
});

router.post('/sms_send', (req, res) => {
  const { phoneNumber } = req.session.data;
  notify.sendSms(
    '68352961-fcc9-451a-9f39-ce98d53b8408',
    phoneNumber
  )
  res.redirect('/sms_2');
});

router.post('/email_send', (req, res) => {
  const { emailAddress } = req.session.data;
  notify.sendEmail(
    '340db034-9438-49e6-a4f2-cd3d4cf1bece',
    emailAddress
  );

  res.redirect('/email_alert');
});

module.exports = router
