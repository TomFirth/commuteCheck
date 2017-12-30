const nodemailer = require('nodemailer')
const Twitter = require('twitter')

const utilities = require('../libs/utilities')

const connect = require('../config/connect')
const details = require('../config/details')

const googleMaps = require('@google/maps')
.createClient({
  key: connect.google.apiKey
})

let output = {
  keywords: [],
  steps: [],
  twitter: []
}
let keywords = []
let keywordArray = []

const TwitterClient = new Twitter({
  consumer_key: connect.twitter.consumerKey,
  consumer_secret: connect.twitter.consumerSecret,
  access_token_key: connect.twitter.accessToken,
  access_token_secret: connect.twitter.accessTokenSecret,
  timeout_ms: 60 * 1000
})

const flow = module.exports = {}

async function requestGoogle (output) {
  const loc = utilities.checkOrigin()
  const travelDuration = utilities.expectedTravelDuration()
  await googleMaps.directions({
    origin: loc.origin,
    destination: loc.destination
  }, (error, response) => {
    if (error) console.log(error)
    const routes = response.json.routes[0]
    routes.legs[0].steps.map((step, instruction) => {
      output.steps.push(step.html_instructions)
      let keyword = utilities.filterGoogleResponse(step.html_instructions)
      keywordArray.push(keyword)
      keywordArray = keywordArray.filter((x, i, a) => a.indexOf(x) === i)
    })
    keywords.push(keywordArray)
    let expected = 'Normal expected travel time'
    if (travelDuration.toFixed(2) < output.duration) {
      let timeDiff = utilities.timeDifference(output.duration)
      expected = `Your journey is estimated to be ${timeDiff} longer than normal.`
    }
    return {
      duration: (routes.legs[0].duration.value / 60).toFixed(2),
      from: routes.legs[0].start_address,
      to: routes.legs[0].end_address,
      keywords,
      steps: routes.legs[0].steps,
      warnings: routes.warnings || [],
      expected
    }
  })
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
    await output.keywords.map(keyword => {
      twitterParams['q'] = 'M20'
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
    return output
  } catch (error) {
    console.error('++ requestTwitter flow', error)
  }
}

async function notifyUser (output) {
  try {
    const mailer = connect.nodemailer
    let transporter = nodemailer.createTransport({
      host: mailer.smtp,
      port: mailer.port,
      secure: true,
      auth: {
        user: mailer.email,
        pass: mailer.password
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
      if (error) return console.log(error)
      console.log('Message sent:', info.response)
    })
  } catch (error) {
    console.error(error)
  }
}

flow.commuteCheck = () => {
  return requestGoogle(output)
  .then(requestTwitter(output))
  .then(console.log(output))
  // .then(notifyUser(output))
}
