const http = require('http');

const getRequest = function(options) {
  return new Promise(resolve => {
    http.get(options, response => {
      let status = response.statusCode;
      let data = '';
      response.on('data', _data => (data += _data));
      response.on('end', () => resolve({data, status}));
    });
  });
}

const postRequest = function(options, postData) {
  return new Promise(resolve => {
    let stringPostData = JSON.stringify({postData});
    const req = http.request(options, response => {
      let status = response.statusCode;
      res.setEncoding('utf8');
      let data = '';
      response.on('data', _data => (data += _data));
      response.on('end', () => {console.log("_____===____", data, status);return resolve({data, status})});
    });
    req.on('error', (e) => resolve({error: e.message}));
    req.write(stringPostData);
    req.end();
  });
}

module.exports = getRequest, postRequest;