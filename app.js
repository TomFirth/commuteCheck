const https = require('http')
const flow = require('./flow/commuteCheck')

flow.commuteCheck()

https.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Nothing to see here.')
}).listen(8080)
