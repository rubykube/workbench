// const request = require('request');

// export default 
// request.get('http://some.server.com/', {
//   'auth': {
//     'bearer': 'bearerToken'
//   }
// });
// export default function post(url, data) {
//   return new Promise(resolve => {
//     http.get({path: url}, response => {
//       let data = '';
//       response.on('data', _data => (data += _data));
//       response.on('end', () => resolve(data));
//     });
//   });
// }

const requestStatus = require('./getStatus');
const urljoin = require('urljoin');
const parseUrl = require("parse-url");

const postToAPI = function(domain, api_url, endpoint, data, jwt = "") {
    // join api_url and endpoint 
    api_url = urljoin(api_url, endpoint);
    // parse domain for options in http.get
    var url = parseUrl(domain);
    var options = {
        protocol: url.protocol+":",
        hostname: url.resource,
        port: url.port,
        path: api_url,
        method: "POST",
    }
    if (jwt !== "") {
        options.headers = {'Authorization': "Bearer " + jwt};
    }
    return requestStatus(options).then((status) => status);
}

module.exports = postToAPI;