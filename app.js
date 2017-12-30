const cron = require('node-cron')
const http = require('http')
const flow = require('./flow/commuteCheck')
const utilities = require('./libs/utilities')
const details = require('./config/details')

const home = utilities.timeForCron(details.home.leave)
cron.schedule(`${home.minutes} ${home.hour} * * 1-5`, () => {
  flow.commuteCheck()
})

const work = utilities.timeForCron(details.work.leave)
cron.schedule(`${work.minutes} ${work.hour} * * 1-5`, () => {
  flow.commuteCheck()
})

flow.commuteCheck()

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.write('Running check')
  flow.commuteCheck()
  res.end()
}).listen(8080)
