const getRequest = require('./request');
const postRequest = require('./request');
const urljoin = require('urljoin');
const parseUrl = require("parse-url");

var config = require('../configuration')

const requestAPI = function(method, endpoint, jwt, postData) {
    api_url = urljoin(config.PEATIO_API_PATH, endpoint);
    var url = parseUrl(config.PEATIO_URL);
    var options = {
        protocol: `${url.protocol}:`,
        hostname: url.resource,
        port: url.port,
        path: api_url,
        method: method
    }
    if (jwt) {
        options.headers = {'Authorization': "Bearer " + jwt};
    }
    if (method == "GET") {
        return getRequest(options).then((data) => data);
    } else if (method == "POST") {
        if (postData) {
            options['Content-Type'] = "application/javascript";
        }
        return postRequest(options, postData).then((data) => data);
    } else {
        return {};
    }
    
}

module.exports = requestAPI;