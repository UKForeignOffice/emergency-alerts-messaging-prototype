const DynamicsWebApi = require('dynamics-web-api')
const AuthenticationContext = require('adal-node').AuthenticationContext

const { DYNAMICS_AUTHORITY_URL, DYNAMICS_ORGANISATION_URL, DYNAMICS_CLIENT_ID, DYNAMICS_USERNAME, DYNAMICS_PASSWORD, DYNAMICS_WEB_API_URL } = process.env

const adalContext = new AuthenticationContext(DYNAMICS_AUTHORITY_URL, false)

const acquireToken = (dynamicsWebApiCallback) => {
  const adalCallback = (error, token) => {
    if (!error) {
      return dynamicsWebApiCallback(token)
    }
    console.log('Token has not been retrieved. Error: ' + error.stack)
  }
  adalContext.acquireTokenWithUsernamePassword(DYNAMICS_ORGANISATION_URL, DYNAMICS_USERNAME, DYNAMICS_PASSWORD, DYNAMICS_CLIENT_ID, adalCallback)
}

const dynamicsWebApi = new DynamicsWebApi({
  webApiUrl: DYNAMICS_WEB_API_URL,
  onTokenRefresh: acquireToken
})

module.exports = {
  saveToCrm: async data => {
    try {
      let contact = await dynamicsWebApi.retrieveRequest({
        filter: `emailaddress1 eq '${data.emailAddress}'`,
        collection: 'contacts',
        select: ['contactid', 'emailaddress1']
      })
      let contactId
      if (!contact.value.length) {
        const contactData = {
          emailaddress1: data.emailAddress
        }
        contact = await dynamicsWebApi.create(contactData, 'contacts', ['return=representation'])
        contactId = contact.contactid
        console.log(contact)
      } else {
        contactId = contact.value[0].contactid
      }

      const country = await dynamicsWebApi.retrieveRequest({
        filter: `cap_name eq '${data.country === 'Myanmar' ? 'Myanmar (Burma) travel advice team' : data.country}'`,
        collection: 'cap_locations',
        select: ['cap_locationid']
      })
      if (country.value.length) {
        // create emergency alert record
        const emergencyAlert = {
          'fco_contact@odata.bind': `/contacts(${contactId})`,
          'fco_country@odata.bind': `/cap_locations(${country.value[0].cap_locationid})`,
          fco_messagetext: data.message,
          fco_dateandtime: (new Date()).toISOString(),
          fco_channel: data.channel
        }
        const alert = await dynamicsWebApi.create(emergencyAlert, 'fco_emergencyalerts', ['return=representation'])
        console.log(alert)
        return alert
      }
      return null
    } catch (err) {
      console.error(err)
      return null
    }
  },
  getAlerts: async (countryName) => {
    const country = await dynamicsWebApi.retrieveRequest({
      filter: `cap_name eq '${countryName === 'Myanmar' ? 'Myanmar (Burma) travel advice team' : countryName}'`,
      collection: 'cap_locations',
      select: ['cap_locationid', 'cap_name']
    })
    const alerts = await dynamicsWebApi.retrieveRequest({
      filter: `_fco_country_value eq '${country.value[0].cap_locationid}'`,
      collection: 'fco_emergencyalerts',
      select: ['_fco_contact_value', '_fco_country_value', 'fco_messagetext', 'fco_dateandtime', 'fco_channel']
    })
    return Promise.allSettled(
      alerts.value.map(async alert =>
        dynamicsWebApi.retrieveRequest({
          filter: `contactid eq '${alert._fco_contact_value}'`,
          collection: 'contacts',
          select: ['contactid', 'emailaddress1']
        })
      )
    ).then(results => {
      return results.map((result, idx) => {
        const { fco_messagetext, fco_dateandtime, fco_channel  } = alerts.value[idx]
        return {
          country: country.value[0].cap_name,
          emailAddress: result.value.value[0].emailaddress1,
          fco_messagetext,
          fco_dateandtime,
          fco_channel
        }
      })
    })
  }
}
