const jsonwebtoken = require('jsonwebtoken');
const base64 = require('base-64');


const jwtGenerator = function(user, key) {
  // now we decode base64 private key
  var decodeKey = base64.decode(key);
  // generate jwtoken
  var token = jsonwebtoken.sign(user, decodeKey, {algorithm: "RS256"});
  //console.log(token);
  return token;
};

module.exports = jwtGenerator;