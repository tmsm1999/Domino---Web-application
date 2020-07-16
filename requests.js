const url = require('url');
const fs = require('fs');
const crypto = require('crypto');
const processRequest = require("./requests.js");
const headers = require("./headers").headers;
const conf = require("./conf.js");
const path = require("path");

function getMediaType(pathname) {
    const pos = pathname.lastIndexOf('.');
    let mediaType;

    if(pos !== -1) 
       mediaType = conf.mediaTypes[pathname.substring(pos+1)];

    if(mediaType === undefined)
       mediaType = 'text/plain';
    return mediaType;
}

function isText(mediaType) {
    if(mediaType.startsWith('image'))
      return false;
    else
      return true;
}

function getPathname(request) {
    const purl = url.parse(request.url);
    let pathname = path.normalize(conf.documentRoot+purl.pathname);

    if(! pathname.startsWith(conf.documentRoot))
       pathname = null;

    return pathname;
}

function doGetPathname(pathname,response) {
    const mediaType = getMediaType(pathname);
    const encoding = isText(mediaType) ? "utf8" : null;

    fs.readFile(pathname,encoding,(err,data) => {
    if(err) {
        response.writeHead(404); // Not Found
        response.end();
    } else {
        response.writeHead(200, { 'Content-Type': mediaType });
        response.end(data);
    }
  });    
}

module.exports.processGetRequest = function(request, response) {

	var parsedUrl = url.parse(request.url, true);
	var query = parsedUrl.query;
	var body = '';
	var pathname = getPathname(request);

    if(pathname === null) {
        response.writeHead(403); // Forbidden
        response.end();
    } else 
        fs.stat(pathname,(err,stats) => {
            if(err) {
                response.writeHead(500); // Internal Server Error
                response.end();
            } else if(stats.isDirectory()) {
                if(pathname.endsWith('/'))
                   doGetPathname(pathname+conf.defaultIndex,response);
                else {
                   response.writeHead(301, // Moved Permanently
                                      {'Location': pathname+'/' });
                   response.end();
                }
            } else 
                doGetPathname(pathname,response);
       });    
}

module.exports.processPostRequest = function(request, response) {

	let parsedURL = url.parse(request.url, true);
	let pathName = parsedURL.pathname;

	var body = "";

	request.on("data", function(chunck) {
		body += chunck;
	}); 

	request.on("end", function() {

		try {
			console.log("Corpo: " + body);
			var query = JSON.parse(body);
		}
		catch(err) {

			console.log(err.message);
			response.writeHead(400, headers["plain"]);
			response.write(JSON.stringify({error: "Error parsing JSON request: " + err + "."}));
			response.end();
			return;
		}

		console.log(pathName);

		switch(pathName) {

			case "/register":

				console.log("aqui");

				if(query["nick"] == null) {
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Nickname is undefined."}));
					response.end();
					break;
				}
				else if(query["pass"] == null) {
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Password is undefined."}));
					response.end();
					break;
				}

				var result = checkCredentials(query["nick"], query["pass"]);

				if(result == 1) {
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "User registered with a different password."}));
					response.end();
				}
				else if(result == 2) {
					response.writeHead(500, headers["plain"]);
					response.end();
				}
				else {
					response.writeHead(200, headers["plain"]);
					response.write(JSON.stringify({}));
					response.end();
				}

				break;

			case "/ranking":

				try {

					var fileData = fs.readFileSync("./public_html/Recursos/JavaScript/Data/users.json");
					var dataObject = JSON.parse(fileData.toString())["users"];
				}
				catch(err) {

					console.log(err);
					response.writeHead(500, headers["plain"]);
					response.end();
					break;
				}

				var arrayWithData = [];

				for(i = 0; i < dataObject.length; i++) {

					if(dataObject[i]["games"] != null) {
						arrayWithData.push({nick: dataObject[i]["nick"], games: dataObject[i]["games"], victories: dataObject[i]["victories"]});
					}
				}

				for(i = 0; i < arrayWithData.length; i++) {
					for(j = 0; j < arrayWithData.length; j++) {

						if(arrayWithData[i]["victories"] > arrayWithData[j]["victories"]) {

							var temp = arrayWithData[i];
							arrayWithData[i] = arrayWithData[j];
							arrayWithData[j] = temp;
						}
					}
				}

				console.log(arrayWithData[0]["nick"]);
				console.log(arrayWithData[1]["nick"]);

				arrayWithData = arrayWithData.slice(0, 10);
				var finalObject = {ranking: arrayWithData};

				console.log(finalObject);

				response.writeHead(200, headers["plain"]);
				response.write(JSON.stringify(finalObject));
				response.end();
				break;
		}

	});

	request.on("error", function(err) {
		console.log(err.message);
		response.writeHead(400, headers["plain"]);
		response.end();
	});
}

function checkCredentials(nickname, password) {

	if(nickname == "" && password == "") {
		return 1;
	}

	password = crypto.createHash('md5').update(password).digest('hex');

	try {

		var fileData = fs.readFileSync("./public_html/Recursos/JavaScript/Data/users.json");
		var dataObject = JSON.parse(fileData.toString())["users"];
	}
	catch(err) {
		console.log(err);
		return 2;
	}

	let found = 0;
	let index = -1;

	for(i = 0; i < dataObject.length; i++) {
		console.log(dataObject[i]["nick"]);
		if(dataObject[i]["nick"] == nickname) {
			found = 1;
			index = i;
			break;
		}
	}

	if(found == 1) {
		console.log("Encontrei!");
		if(dataObject[index]["pass"] == password) {
			return 0;
		}

		return 1;
	}

	dataObject.push({nick: nickname, pass: password, games: 0, victories: 0});
	var dataUsers = {users: dataObject};

	try {
		fs.writeFileSync("./public_html/Recursos/JavaScript/Data/users.json", JSON.stringify(dataUsers));
		return 0;
	}
	catch(err) {
		console.log("Error writing to file 'users.json");
		return 2;
	} 

}










































// function doGetPathName(pathName, response) {
// 	const mediaType = getMediaType(pathName);
// 	let encoding = isText(mediaType) ? "utf8" : null;

// 	fs.readFile(pathName, encoding, (err, data) => {
// 		if(err) {
// 			response.writeHead(404);
// 			response.end();
// 		}
// 		else {
// 			response.writeHead(200, {'Content-type:': mediaType });
// 			response.end();
// 		}
// 	});
// }

// function getMediaType(pathName) {
// 	const position = pathName.lastIndexof('.');
// 	let mediaType;

// 	if(pos !== -1) {
// 		mediaType = conf.mediaTypes[pathName.substring(position + 1)];
// 	}

// 	if(mediaType === undefined) {
// 		mediaType = 'text/plain';
// 	}

// 	return mediaType;
// }

// function isText() {
// 	if(mediaType.startsWith('image')) {
// 		return false;
// 	}

// 	return true;
// }

// function getPathName(request) {
// 	const parsedURL = url.parse(request.url);
// 	let pathName = path.normalize(conf.documentRoot + parsedURL.pathName);

// 	if(!pathName.startsWith(conf.documentRoot)) {
// 		pathName = null;
// 	} 
// 	return pathName;
// }

// function doGetRequest(request, response) {
// 	const pathName = getPathName(request);

// 	if(pathName === null) {
// 		response.writeHead(403);
// 		response.end();
// 	}
// 	else {
// 		fs.stat(pathName, (err, stats) => {
// 			if(err) {
// 				response.writeHead(500);
// 				response.end();
// 			}
// 			else if(stats.isDirectory()) {
// 				if(pathName.endsWith('/')) {
// 					doGetPathName(pathName + conf.defaultIndex, response);
// 				}
// 				else {
// 					response.writeHead(301, {'Location: ': pathName + '/'});
// 					response.end();
// 				}
// 			}
// 			else {
// 				doGetPathName(pathName, response);
// 			}
// 		});
// 	}
// }

// function doPostRequest()

// module.exports.doGetRequest = doGetRequest;