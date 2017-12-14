const moment = require('moment')

const details = require('../config/details')
// const excludes = require('../config/excludes')

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

utilities.filterGoogleResponse = () => {
  // filter Google steps into keywords
  // ^^ if isNumber == junction
  // exclude words
  // exclude villages, towns and cities
}

utilities.hoursBefore = () => {
  let dateTime = utilities.getDateTime()
  return moment(dateTime, 'HH:mm').subtract(details.twitter.hoursBefore, 'hours')
}

utilities.expectedTravelDuration = () => {
  // get default travel duration and add 50%?
}
