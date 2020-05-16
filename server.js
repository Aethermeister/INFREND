let http = require('http');
let query = require('./query')

http.createServer(query.handleRequest).listen('8080');