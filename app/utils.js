module.exports = {
  slugify: str => str.toLowerCase().replace(/ /g, '-'),
  prefixPhoneNumber: number => {
    if (number.startsWith('07')) {
      return `44${number.substr(1)}`
    }
    return number
  }
};
