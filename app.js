const http = require('http')
const flow = require('./flow/commuteCheck')

flow.commuteCheck()
http.createServer((req, res) => {
  if (req.url === '/auth') {
    // authentication stuff
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write('Authentication')
    res.end()
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write('Running check')
    flow.commuteCheck()
    res.end()
  }
}).listen(8080)
