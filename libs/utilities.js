const moment = require('moment')

const details = require('../config/details')
const excludes = require('../config/excludes')

const utilities = module.exports = {}

utilities.getDateTime = () => {
  return {
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm')
  }
}

utilities.checkOrigin = () => {
  const dateTime = utilities.getDateTime()
  let origin
  let destination
  if (dateTime.time > details['home'].leave) {
    origin = 'home'
    destination = 'work'
  } else {
    origin = 'work'
    destination = 'home'
  }
  return {
    origin: details[origin].postcode,
    destination: details[destination].postcode,
    lat: details[origin].lat,
    long: details[origin].long
  }
}

utilities.filterGoogleResponse = (string) => {
  let stringArray = []
  string = string.match(/<b>(.*?)<\/b>/g)
  .map(string => {
    string = string.replace(/<\/?b>/g, '')
    if (excludes.indexOf(string) === -1) {
      if (!isNaN(string)) {
        string = 'Junction ' + string
      }
      stringArray.push(string)
    }
  })
  string = stringArray.join(' ')
  return string
}

utilities.hoursBefore = () => {
  let dateTime = utilities.getDateTime()
  return moment(dateTime, 'HH:mm').subtract(details.twitter.hoursBefore, 'hours')
}

utilities.expectedTravelDuration = () => {
  // get default travel duration and add 50%?
  return details.duration
}

utilities.timeDifference = (expected) => {
  // expected - details.duration
  return expected
}
