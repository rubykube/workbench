const http = require('http');

const requestStatus = function(options) {
  return new Promise(resolve => {
    http.request(options, response => {
      const { statusCode } = response;
      resolve(statusCode)
    });
  });
}

module.exports = requestStatus;