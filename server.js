"use strict";

var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

var portNumber = 4000;

function send404(response, filePath) {
    if (filePath) {
        console.error('404 Not Found:', filePath);
    }
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    console.log('200 ', filePath);
    response.writeHead(
        200,
        {"content-type": mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function (exists) {
            if (exists) {
                //Check if file is cached in memory
                //Serve file from memory Check if file exists
                //Read file from disk
                //Serve file read from disk
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send404(response, absPath);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}

var server = http.createServer(function (request, response) {
    var filePath = false;
    //Create HTTP server, using anonymous function to define per-request behavior
    if (request.url == '/') {
        filePath = 'index.html';
    } else {
        filePath = (request.url.startsWith('/') ? './' : '') + request.url;
    }
    //Determine HTML file to be served by default
    //Translate URL path to relative file path
    //
    //Serving the application’s HTML, CSS, and client-side JavaScript 23
    var absPath = filePath;
    //if (absPath && absPath.startsWith('/')) {
    //    absPath = '.' + absPath;
    //}
    serveStatic(response, cache, absPath);
    //Serve static file
});


server.listen(portNumber, function () {
    console.log("Server listening on port " + portNumber + ".");
});