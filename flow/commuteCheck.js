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
  twitter: []
}
let steps = []
let keywordArray = []

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
    const travelDuration = utilities.expectedTravelDuration()
    googleMaps.directions({
      origin: loc.origin,
      destination: loc.destination
    }, (err, response) => {
      if (!err) {
        const legs = response.json.routes[0].legs[0]
        const warnings = response.json.routes[0].warnings
        output['duration'] = (legs.duration.value / 60).toFixed(2)
        output['from'] = legs.start_address
        output['to'] = legs.end_address
        if (warnings.length > 0) {
          output['warnings'] = warnings
        }
        legs.steps.map((step, instruction) => {
          let keyword = utilities.filterGoogleResponse(step.html_instructions)
          keywordArray.push(keyword)
          keywordArray = keywordArray.filter((x, i, a) => a.indexOf(x) === i)
        })
        steps.push(keywordArray)
        output['steps'] = steps
        output['expected'] = 'Normal expected travel time'
        if (travelDuration.toFixed(2) < output.duration) {
          let timeDiff = utilities.timeDifference(output.duration)
          output['expected'] = `Your journey is estimated to be ${timeDiff} longer than normal.`
        }
      }
    })
    return output
  } catch (err) {
    console.log('++ requestGoogle', err)
  }
}

flow.requestTwitter = async () => {
  try {
    console.log('Twitter Request')
    const loc = utilities.checkOrigin()
    const twitterParams = {
      count: details.twitter.count,
      geocode: loc.lat + loc.long + details.radius,
      lang: details.lang,
      result_type: 'recent'
    }
    // let searchKeywords = output.steps
    // searchKeywords.map(keyword => {})
    twitterParams['q'] = 'M20'
    TwitterClient.get('search/tweets', twitterParams, (error, tweets, response) => {
      if (error) console.log('++ requestTwitter get', error)
      const hoursBefore = utilities.hoursBefore()
      tweets.statuses.map(tweet => {
        console.log(tweet.created_at)
        if (tweet.created_at > hoursBefore) {
          output['twitter'].push({
            text: tweet.text
          })
        }
      })
    })
    return output
  } catch (err) {
    console.error('++ requestTwitter flow', err)
  }
}

flow.notifyUser = async () => {
  try {
    console.log('Sending data')
    const nm = connect.nodemailer
    let transporter = nodemailer.createTransport({
      host: nm.smtp,
      port: nm.port,
      secure: true,
      auth: {
        user: nm.email,
        pass: nm.password
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
  } catch (err) {
    console.error(err)
  }
}

flow.commuteCheck = async (notify) => {
  console.log(await flow.requestGoogle())
  console.log(await flow.requestTwitter())
  if (notify) {
    console.log(await flow.notifyUser())
  }
  console.log('All done')
}
