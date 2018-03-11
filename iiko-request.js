/*

name: iiko-card5
documentation: https://docs.google.com/document/d/1kuhs94UV_0oUkI2CI3uOsNo_dydmh9Q0MFoDWmhzwxc/edit#
author: pub42 (xziy, ...)

(c) 2018
v 0.1
*/
var https = require('https'); // iiko biz support only SSL requests





var config, access_token;
exports.init = function(_config) {
        config = _config; 
};
///////////////////////////////////////////////////////////////////////////////////

exports.exec = function(method, data) {
	return promise = new Promise(function(resolve, reject) {
		switch(method.type) {
		
			case 'GET': 
				  get(fetchGETurl(method, data));
				break

			case 'POST':
					// TODO: make POST request as GET analogie
				break

			default:
					reject('Method is not defined');
				break
		}

	});
};



function fetchGETurl(method, data) {
	let url = method.path+'?';

	for (var param in method.params) {
		if (!data.hasOwnProperty(param)){
			console.error("iiko-request: The expected "+ param +" property is not found");		
		} 
		url = url + param '='+data[param]+'&'
	}
	return url
}

function get(url) {
return  promise = new Promise(function(resolve, reject) {
				let path = url + '&access_token=' + access_token;
        checkToken().then(function(token) {
                https.get({
                    hostname: config.host,
                    port: config.port,
                    path: path,
                    agent: false // create a new agent just for this one request
                }, (res) => {
                    let rawData = '';
                    res.on('data', (data) => {
                        rawData += data;
                    });

                    res.on('end', () => {
                        try {
                            data = JSON.parse(rawData);
                            resolve(data);
                        } catch (e) {
                            //console.log(e.message);
                        }
                    });
                });
            }); // __checkToken
        });
};
///////////////////////////////////////////////////////////////////////////////////

function getToken() {
    // Получение токена
    //console.log(" IN __getToken");
    let promise = new Promise(function(resolve, reject) {
        let path = '/api/0/auth/access_token?user_id=' + config.login + '&user_secret=' + config.password;
        https.get({
            hostname: config.host,
            port: config.port,
            path: path,
            agent: false // create a new agent just for this one request
        }, (res) => {

            res.on('data', (token) => {
                access_token = JSON.parse(token);
                register.token = access_token
                resolve(access_token);
            });
        });
    });
    return promise;
    //console.log(" OUT __getToken");
};

///////////////////////////////////////////////////////////////////////////////////
function checkToken() {
    // Проверяет токен, если токен нерабочий то получет токен
    //console.log("IN __checkToken");
    let promise = new Promise(function(resolve, reject) {
        let path = '/api/0/auth/echo?msg=true&access_token=' + access_token;
        //console.log(path);
        https.get({
            hostname: config.host,
            port: config.port,
            path: path,
            agent: false // create a new agent just for this one request
        }, (res) => {

            res.on('data', (response) => {
                if (response.toString() == '"Wrong access token"') {
                    this.getToken().then(function(token) {
                        resolve(token);
                    });
                }

                if (response.toString() == '"true"') {
                    resolve(access_token);
                }
            });
        });
    });

    return promise
    //console.log(" OUT  __checkToken");
};
