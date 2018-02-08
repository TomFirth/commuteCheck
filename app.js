const https = require('http')
const flow = require('./flow/commuteCheck')
const port = process.env.PORT || 8080

flow.commuteCheck()

https.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Nothing to see here.')
}).listen(port)
