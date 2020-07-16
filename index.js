"use strict";

let PORT = 8143;
const http = require('http');
const url = require('url');
const process = require("./requests.js");
const conf = require("./conf.js");

const dominoServer = http.createServer(function(request, response) {
	console.log("teste");
	console.log(request.method);
	switch(request.method) {
		case 'GET':
			console.log("teste");
			process.processGetRequest(request, response);
			break;
		case 'POST':
			process.processPostRequest(request, response);
			break;
		default:
			response.writeHead(501, headers["plain"]);
			response.end();
	}
});

dominoServer.listen(PORT);
console.log("Server running on port " + PORT);