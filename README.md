# commuteCheck
Check for keywords that warn against delays or accidents on my commute.

## What
This script runs on a Heroku cron instance twice a day, before I leave to and from work.

#### The app will check the following:
- Google Maps API for a live estimate of your commute time, Waze warnings and keywords for the following step.
- Twitter with keywords from Google.

The aim of this is to be an early warning system and to not overload you with too much noise on a bi-daily basis, but give you a quick glance, automated search to help you decide on whether you should; work from home, leave later or to sort sort some ipods or a new playlist out for the expected traffic.

## Usage
- create api tokens for `Google directions`, `Twitter` and `Nodemailer` and add to `connect.json`.
- edit the `details.json` config with (times and locations) - these will need to be stored in Heroku.
- push to a heroku cron server (the cron's start times will need to be set outside of this script).
