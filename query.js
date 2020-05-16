const url = require('url');
let path = require('path');
let http = require('http');
let cmd = require('./commands');
let routes = require('./routes');

module.exports = {
    handleRequest(request, response) {

        let path = url.parse(request.url);
        if(path.search !== null) {
            var q = url.parse(request.url, true).query;
            cmd.executeCommand(q, response);
            return;
        }
        else {
            routes.render(path.pathname, response);
        }
    }
}