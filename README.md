# commuteCheck
Check for keywords that warn against accidents on my commute

## What
This app runs on Heroku twice a day, before I begin my drive to and from work.

The app searches Twitter for a number of tweets within a set period of time.

The app will also check the Google Maps API for my estimated route time

Waze will be used to check for accidents on main roads

If the results meet the parameters, the app contacts the user to warn about the route and then I can either work from home, plan another route or leave later that day.

## Usage
- edit the details config (times and locations)
- edit the Twitter, Google Maps, Waze and Twillo api details
- edit your contact details
- push to heroku
