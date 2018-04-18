const base64 = require("base-64");
var config = require('./configuration');
var rs = require('jsrsasign');
var rsu = require('jsrsasign-util');


var sPrvKey = base64.decode(config.MULTISIGN_PRIVATE_KEY);

prvKeyObj = rs.KEYUTIL.getKey(sPrvKey);

var sHeader = rs.newline_toDos(JSON.stringify({"alg":"RS256"}));
var sPayload = rs.newline_toDos(JSON.stringify({"some": "payload"}));


var jwsjs = new rs.KJUR.jws.JWSJS();
var jws1 = rs.KJUR.jws.JWS.sign(null, sHeader, sPayload, sPrvKey);
jwsjs.initWithJWS(jws1)

jwsjs.addSignature(null, sHeader, sPrvKey);

console.log(rs.newline_toDos(JSON.stringify(jwsjs.getJSON(), null, 2)));

