const request = require('./get');
const urljoin = require('urljoin');
const parseUrl = require("parse-url")

const getFromAPI = function(domain, api_url, endpoint, jwt = "") {
    api_url = urljoin(api_url, endpoint);
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
    return request(options).then((data) => {console.log("RESPONSE----->");data});
}

module.exports = getFromAPI;