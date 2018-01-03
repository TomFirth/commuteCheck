const nodemailer = require('nodemailer')
const Twitter = require('twitter')

const utilities = require('../libs/utilities')

const details = require('../config/details')
const includes = require('../config/includes')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const googleMaps = require('@google/maps')
.createClient({
  key: process.env.google_apiKey
})

let output = {
  keywords: [],
  steps: [],
  twitter: [],
  warnings: []
}
let keywordArray = []

if (includes.length > 0) {
  includes.forEach(keyword => {
    keywordArray.push(keyword)
  })
}

const TwitterClient = new Twitter({
  consumer_key: process.env.twitter_consumerKey,
  consumer_secret: process.env.twitter_consumerSecret,
  access_token_key: process.env.twitter_accessToken,
  access_token_secret: process.env.twitter_accessTokenSecret,
  timeout_ms: 60 * 1000
})

const flow = module.exports = {}

async function requestGoogle (output) {
  const GoogleResponse = await (
    new Promise((resolve, reject) => {
      const loc = utilities.checkOrigin()
      const travelDuration = utilities.expectedTravelDuration()
      googleMaps.directions({
        origin: loc.origin,
        destination: loc.destination
      }, (error, response) => {
        if (error) resolve(error)
        const routes = response.json.routes[0]
        routes.legs[0].steps.map((step, instruction) => {
          output.steps.push('<br />' + step.html_instructions)
          keywordArray.push(utilities.filterGoogleResponse(step.html_instructions))
          keywordArray = keywordArray.filter((x, i, a) => a.indexOf(x) === i)
        })
        output.keywords.push(keywordArray)
        let expected = 'Normal expected travel time'
        if (travelDuration.toFixed(2) < output.duration) {
          let timeDiff = utilities.timeDifference(output.duration)
          expected = `Your journey is estimated to be ${timeDiff} longer than normal.`
        }
        output['duration'] = (routes.legs[0].duration.value / 60).toFixed(2)
        output['from'] = routes.legs[0].start_address
        output['to'] = routes.legs[0].end_address
        output['warnings'] = routes.warnings
        output['expected'] = expected
        resolve()
      })
    })
  )
  return GoogleResponse
}

async function requestTwitter (output) {
  try {
    const loc = utilities.checkOrigin()
    const twitterParams = {
      count: details.twitter.count,
      geocode: loc.lat + loc.long + details.radius,
      lang: details.lang,
      result_type: 'recent'
    }
    if (output.keywords && output.keywords.length > 0) {
      const TwitterResponse = await output.keywords[0].map(keyword => {
        twitterParams['q'] = keyword
        TwitterClient.get('search/tweets', twitterParams, (error, tweets, response) => {
          if (error) console.log(error)
          const hoursBefore = utilities.hoursBefore()
          tweets.statuses.map(tweet => {
            if (tweet.created_at > hoursBefore) {
              output['twitter'].push({
                text: tweet.text
              })
            }
          })
        })
      })
      return TwitterResponse
    }
  } catch (error) {
    console.error('++ requestTwitter flow', error)
  }
}

async function notifyUser (output) {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.nodemailer_smtp,
      port: process.env.nodemailer_port,
      secure: true,
      auth: {
        user: process.env.nodemailer_email,
        pass: process.env.nodemailer_password
      }
    })
    const text = `${output.from} to ${output.to} will take <b>${output.duration}</b><br />
${output.warnings.length > 0 ? '<b>Google Maps warnings:</b>' + output.warnings + '<br /><br />' : ''}
${output.twitter.length > 0 ? '<b>Twitter alerts:</b>' + output.twitter + '<br /><br />' : ''}
<b>Directions:</b> ${output.steps}`
    const mailOptions = {
      from: `"commuteCheck" <${details.email}>`,
      to: `${details.email}`,
      subject: `commuteCheck > ${output.expected}`,
      text: '',
      html: text
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return console.log(error)
      console.log('Message sent:', info.response)
    })
  } catch (error) {
    console.error(error)
  }
}

flow.commuteCheck = () => {
  return requestGoogle(output)
  .then(() => requestTwitter(output))
  .then(() => notifyUser(output))
}
