let http = require('http');
const url = require('url');
let path = require('path');
let fs = require('fs');

module.exports = {
    render(pathname, response) {
        response.writeHead(200, {
            'Content-Type' : 'text/html'
        });

        var file = html.selectHTML(pathname, response);

        fs.readFile(String(file), null, function (error, data) {
            if (error) {
                response.writeHead(404);
                response.write('file not found');
            } else {
                response.write(data);
            }
            response.end();
        });
    }
}

html = {
    selectHTML(pathname, response) {

        switch(pathname) {
            case '/':
            case '/index.html':
                return './index.html';
            case '/about.html':
                return './about.html';
            case '/flats.html':
                return './flats.html';
            case '/addflat.html':
                return './addflat.html';
            case '/residents.html':
                return './residents.html';
            case '/addresident.html':
                return './addresident.html';
            case '/removeresident.html':
                return './removeresident.html';
            case '/transaction.html':
                return './transaction.html';
            default:
                response.writeHead(404);
                response.write('Page not found!');
        }
    }
}