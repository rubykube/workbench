const requestStatus = require('./getStatus');
const urljoin = require('urljoin');
const parseUrl = require("parse-url");

const getFromAPI = function(domain, api_url, endpoint, jwt = "") {
    // join api_url and endpoint 
    api_url = urljoin(api_url, endpoint);
    // parse domain for options in http.get
    var url = parseUrl(domain);
    var options = {
        protocol: url.protocol+":",
        hostname: url.resource,
        port: url.port,
        path: api_url,
        method: "GET",
    }
    if (jwt !== "") {
        options.headers = {'Authorization': "Bearer " + jwt};
    }
    return requestStatus(options).then((status) => status);
}

module.exports = getFromAPI;