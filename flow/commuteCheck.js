// const nodemailer = require('nodemailer')
// const TwitterPackage = require('twitter')
// const Waze = require('waze')

const connect = require('../config/connect')
const details = require('../config/details')
const excludes = require('../config/excludes')

let output = {}
let steps = []

const googleMaps = require('@google/maps')
.createClient({
  key: connect.google.apiKey
})

// const Twitter = new TwitterPackage({
//   consumer_key: connect.twitter.consumerKey,
//   consumer_secret: connect.twitter.consumerSecret,
//   access_token_key: connect.twitter.accessToken,
//   access_token_secret: connect.twitter.AccessTokenSecret
// })

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
    const dateTime = flow.getDateTime()
    let origin = details.home.postcode
    let destination = details.work.postcode
    if (dateTime.time > details.home.leave) {
      origin = details.work.postcode
      destination = details.home.postcode
    }
    return await googleMaps.directions({
      origin,
      destination
    }, (err, response) => {
      if (!err) {
        const legs = response.json.routes[0].legs[0]
        output['duration'] = legs.duration.text
        output['from'] = legs.start_address
        output['to'] = legs.end_address
        legs.steps.map((step, instruction) => {
          steps.push(step.html_instructions)
        })
        output['steps'] = steps
        console.log('++ output', output)
      }
    })
  } catch (err) {
    console.log('++ requestGoogle', err)
  }
}

// flow.requestTwitter = async () => {
//   try {
//     console.log('Twitter Request')
//     const path = ''
//     const params = {}
//     Twitter.get(path, params, () => {
//       // deal with Twitter stuff
//     })
//   } catch (err) {
//     console.error('++ requestTwitter', err)
//   }
// }

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
  console.log('++ requestGoogle', await flow.requestGoogle())
  // console.log(await flow.requestTwitter())
  // console.log(await flow.requestWaze())
  // console.log(await flow.notifyUser())
  console.log('all done')
}
