const TwitterPackage = require('twitter')
const port = process.env.PORT || 8080
require('dotenv').config()

const Twitter = new TwitterPackage({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

const getDate = async () => {
  try {
    // stuff
  } catch(err){
    console.error(err) 
  }
}

const getKeywords = async () => {
  try {
    // stuff
  } catch(err){
    console.error(err) 
  }
}

const requestTwitter = async () => {
  // check twitter for tweets
  try {
    // stuff
    client.get(path, params, callback)
  } catch(err){
    console.error(err) 
  }
}

const emailUser = async () => {
  try {
    // stuff
  } catch(err){
    console.error(err) 
  }
}

const commuteCheck = async () => {
  console.log(await getDate())
  console.log(await getKeywords())
  console.log(await requestTwitter())
  return 'all done'
}()
