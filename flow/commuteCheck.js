// const nodemailer = require('nodemailer')
const Twitter = require('twitter')
// const Waze = require('waze')

const connect = require('../config/connect')
const details = require('../config/details')
// const excludes = require('../config/excludes')

let output = {}
let steps = []

const googleMaps = require('@google/maps')
.createClient({
  key: connect.google.apiKey
})

const TwitterClient = new Twitter({
  consumer_key: connect.twitter.consumerKey,
  consumer_secret: connect.twitter.consumerSecret,
  access_token_key: connect.twitter.accessToken,
  access_token_secret: connect.twitter.accessTokenSecret,
  timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests
})

const flow = module.exports = {}

flow.getDateTime = async () => {
  try {
    const now = new Date()
    const month = now.getUTCMonth() + 1
    const day = now.getUTCDate()
    const year = now.getUTCFullYear()
    const date = year + '-' + month + '-' + day
    return {
      date,
      time: now.getTime()
    }
  } catch (err) {
    console.error('++ getDateTime', err)
  }
}

flow.requestGoogle = async () => {
  try {
    console.log('Google Request')
    // move to utilities
    const dateTime = flow.getDateTime()
    let origin = details.home.postcode
    let destination = details.work.postcode
    if (dateTime.time > details.home.leave) {
      origin = details.work.postcode
      destination = details.home.postcode
    }
    // move to utilities
    return await googleMaps.directions({
      origin,
      destination
    }, (err, response) => {
      if (!err) {
        const legs = response.json.routes[0].legs[0]
        const warnings = response.json.routes[0].warnings
        output['duration'] = legs.duration.text
        output['from'] = legs.start_address
        output['to'] = legs.end_address
        if (warnings.length > 0) {
          output['warnings'] = warnings
        }
        legs.steps.map((step, instruction) => {
          steps.push(step.html_instructions)
        })
        output['steps'] = steps
        if (details.duration < output.duration) {
          // Google estimates that your expected travel time will be longer than normal.
        }
        // console.log('++ output', output)
      }
    })
  } catch (err) {
    console.log('++ requestGoogle', err)
  }
}

flow.requestTwitter = async () => {
  try {
    console.log('Twitter Request')
    // search tweets by date
    // search tweets by location
    // loop through twitter request with Google response keywords
    TwitterClient.get('search/tweets', {q: 'M20', count: details.twitter.count}, (error, tweets, response) => {
      if (error) {
        console.log('++ requestTwitter get', error)
      }
      console.log(tweets)
    })
  } catch (err) {
    console.error('++ requestTwitter flow', err)
  }
}

// flow.requestWaze = async () => {
//   try {
//     console.log('Waze Request')
//     return 'requestWaze'
//   } catch (err) {
//     console.error('++ requestWaze', err)
//   }
// }

// flow.notifyUser = async () => {
//   try {
//     console.log('Sending data')
//     return 'notifyUser'
//   } catch (err) {
//     console.error(err)
//   }
// }

flow.commuteCheck = async () => {
  console.log(await flow.requestGoogle())
  console.log(await flow.requestTwitter())
  // console.log(await flow.requestWaze())
  // console.log(await flow.notifyUser())
  console.log('all done')
}
