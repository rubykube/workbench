const http = require('http');

const request = function(options) {
  return new Promise(resolve => {
    http.request(options, response => {
      let data = '';
      response.on('data', _data => (data += _data));
      response.on('end', () => resolve(data));
      //response.on('status', () => resolve(response.status));
    });
  });
}

module.exports = request;