const map = require('google_directions')
// const nodemailer = require('nodemailer')
// const TwitterPackage = require('twitter')
// const Waze = require('waze')

const connect = require('../config/connect')
const details = require('../config/details')

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
    console.log({
      date,
      time: now.getTime()
    })
    return {
      date,
      time: now.getTime()
    }
  } catch (err) {
    console.error('++ getDateTime', err)
  }
}

flow.getParams = async () => {
  try {
    const dateTime = flow.getDateTime()
    let origin = details.home.postcode
    let destination = details.work.postcode
    if (dateTime.time > details.home.leave) {
      origin = details.work.postcode
      destination = details.home.postcode
    }
    return {
      google: {
        origin,
        destination,
        key: connect.google.apiKey,
        mode: 'driving',
        avoid: 'none',
        language: 'en',
        units: 'imperial'
      }
    }
  } catch (err) {
    console.error('++ getParams', err)
  }
}

flow.requestGoogle = async () => {
  try {
    const params = flow.getParams()
    console.log('++ params.google', params.google)
    map.getDuration(params.google, (err, data) => {
      if (err) {
        console.log('+ requestGoogle', err)
        return 1
      }
      console.log('requestGoogle data', data)
    })
  } catch (err) {
    console.log('++ requestGoogle', err)
  }
}

// flow.requestTwitter = async () => {
//   try {
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
//     return 'requestWaze'
//   } catch (err) {
//     console.error('++ requestWaze', err)
//   }
// }

// flow.notifyUser = async () => {
//   try {
//     return 'notifyUser'
//   } catch (err) {
//     console.error(err)
//   }
// }

flow.commuteCheck = async () => {
  console.log(await flow.requestGoogle())
  // console.log(await flow.requestTwitter())
  // console.log(await flow.requestWaze())
  // console.log(await flow.notifyUser())
  return 'all done'
}
