# commuteCheck
Check for keywords that warn against delays or accidents on my commute

## What
This app runs on Heroku twice a day, before I begin my drive to and from work.

The app will check the following:
- Google Maps API for my estimated route time
- Twitter for a set number of tweets within a set period of time.
- Waze will be used to check for accidents on main roads

If there are a certain number of responses from any or all of these APIs and/or Google directions returns with a durection which is +10% higher than my normal commute time the script will contact me to warn about the route. I can either work from home, plan another route or leave later that day.

## Usage
- create api tokens for `Google directions`, `Twitter`, `Waze` and `Nodemailer` and add to `connect.json`
- edit the `details` config (times and locations)
- push to heroku
