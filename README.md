# commuteCheck
Check for keywords that warn against delays or accidents on my commute.

## What
This script runs on a Heroku cron instance twice a day, before I leave to and from work (this is set up outside of this repository).

#### The app will check the following:
- Google Maps API for an estimate of your commute time, directions (Google's API will return the fastest journey to your destination and may be different from your normal route). Warnings from Waze are included in the response.
- The app then strips out various keywords from your Google response to search Twitter.

The aim of this is to be an early warning system and to not overload you with too much noise on a bi-daily basis. This is to give you a quick glance, automated search and help you decide on whether you should work from home, leave later or to make a new playlist or find a few podcast for the expected delays.

## Usage
- Create api tokens for `Google directions`, `Twitter` and `Nodemailer` and add to `connect.json`.
- Edit the `details.json` config with (times and locations) - these will need to be stored in Heroku.
- Editing `includes.json` allows you to add specific keywords that might not get picked up by the Google Maps request.
- Push to a heroku cron server (the cron's start times will need to be set outside of this script).
