const http = require('http')
const map = require('google_directions')
const nodemailer = require('nodemailer')
const TwitterPackage = require('twitter')
const Waze = require('waze')

const connect = require('./config/connect')
const details = require('./config/details')

http.createServer((req, res) => {
  if (req.url === '/auth') {
    // authentication stuff
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write('Authentication')
    res.end()
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write('Hello World!')
    commuteCheck()
    res.end()
  }
}).listen(8080)

const Twitter = new TwitterPackage({
  consumer_key: connect.twitter.consumerKey,
  consumer_secret: connect.twitter.consumerSecret,
  access_token_key: connect.twitter.accessToken,
  access_token_secret: connect.twitter.AccessTokenSecret
})

const getDateTime = async () => {
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

const getParams = async () => {
  try {
    const dateTime = getDateTime()
    let origin = details.home.location
    let destination = details.work.location
    if (dateTime.time > details.home.leave) {
      origin = details.work.location
      destination = details.home.location
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

const requestGoogle = async () => {
  try {
    const params = getParams()
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

const requestTwitter = async () => {
  try {
    const path = ''
    const params = {}
    Twitter.get(path, params, () => {
      // deal with Twitter stuff
    })
  } catch (err) {
    console.error('++ requestTwitter', err)
  }
}

const requestWaze = async () => {
  try {
    return 'requestWaze'
  } catch (err) {
    console.error('++ requestWaze', err)
  }
}

const notifyUser = async () => {
  try {
    return 'notifyUser'
  } catch (err) {
    console.error(err)
  }
}

const commuteCheck = async () => {
  console.log(await requestGoogle())
  console.log(await requestTwitter())
  console.log(await requestWaze())
  console.log(await notifyUser())
  return 'all done'
}
