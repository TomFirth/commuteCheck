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

// travelling to work or home?
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

// turn a Google direction instruction into a string of keywords
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

// work out how much time before now to search
utilities.hoursBefore = () => {
  let dateTime = utilities.getDateTime()
  return moment(dateTime.time, 'HH:mm').subtract(details.twitter.hoursBefore, 'hours')
}

// expected duration with a percentage increase
utilities.expectedTravelDuration = () => {
  let expectedTravelDuration = (details.duration).toFixed(2) * 25 / 100
  return parseFloat((details.duration).toFixed(2)) + parseFloat(expectedTravelDuration)
}

// difference in minutes and seconds between normal and expected travel durations
utilities.timeDifference = (expected) => {
  let timeDiff = expected - (details.duration).toFixed(2)
  return (timeDiff).toFixed(2)
}
