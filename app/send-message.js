
module.exports = ({ data, phoneNumber }) => {
  if (data.lastCountryRequested) {
    data.countryUrlSlug = slugify(data.lastCountryRequested)
  }
  if (data.lastTemplateSent) {
    const options = {
      personalisation: data
    };
    notify.sendSms(
      data.lastTemplateSent,
      phoneNumber,
      options
    )
  }
};
