const http = require('http')
const flow = require('./flow/commuteCheck')

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'})
  flow.commuteCheck()
  res.end()
}).listen(8080)
