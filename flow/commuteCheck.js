const nodemailer = require('nodemailer')
const Twitter = require('twitter')

const utilities = require('../libs/utilities')

const connect = require('../config/connect')
const details = require('../config/details')

let output = {
  twitter: []
}
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
  timeout_ms: 60 * 1000
})

const flow = module.exports = {}

flow.requestGoogle = async () => {
  try {
    console.log('Google Request')
    const loc = utilities.checkOrigin()
    googleMaps.directions({
      origin: loc.origin,
      destination: loc.destination
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
        // return output
      }
    })
  } catch (err) {
    console.log('++ requestGoogle', err)
  }
}

flow.requestTwitter = async () => {
  try {
    console.log('Twitter Request')
    const loc = utilities.checkOrigin()
    // loop through twitter request with Google response keywords
    const twitterParams = {
      count: details.twitter.count,
      geocode: loc.lat + loc.long + details.radius,
      lang: details.lang,
      q: 'M20',
      result_type: 'recent'
    }
    TwitterClient.get('search/tweets', twitterParams, (error, tweets, response) => {
      if (error) {
        console.log('++ requestTwitter get', error)
      }
      const hoursBefore = utilities.hoursBefore()
      tweets.statuses.map(tweet => {
        console.log(tweet.created_at)
        if (tweet.created_at < hoursBefore) {
          output['twitter'].push({
            text: tweet.text
          })
        }
      })
      // return output
    })
  } catch (err) {
    console.error('++ requestTwitter flow', err)
  }
}

flow.notifyUser = async () => {
  try {
    console.log('Sending data')
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: connect.nodemailer.email,
        pass: connect.nodemailer.password
      }
    })
    const mailOptions = {
      from: `"commuteCheck" <${details.email}>`,
      to: `${details.email}`,
      subject: 'commuteCheck',
      text: 'test',
      html: '<b>test</b>'
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent:', info.response)
    })
  } catch (err) {
    console.error(err)
  }
}

flow.commuteCheck = async () => {
  console.log(await flow.requestGoogle())
  console.log(await flow.requestTwitter())
  console.log(await flow.notifyUser())
  console.log('All done')
}
