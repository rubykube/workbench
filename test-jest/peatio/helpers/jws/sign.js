const jsonwebtoken = require('jsonwebtoken')
const base64 = require('base-64')
const config = require('../../../config')

module.exports = (payload, key_id) => {
  payload = {
    data: payload,
    iat: Math.round(new Date().getTime() / 1000) - 1,
    exp: Math.round(new Date().getTime() / 1000) + 4 * 3600,
    jti: 'F454AF7134FC22506E06CF93'
  }
  let pem = config.MANAGEMENT_API_SIGNS[key_id].private_key
  let signData = jsonwebtoken.sign(payload, pem, {algorithm: config.MANAGEMENT_API_SIGNS[key_id].algorithm}).split(".")
  return {
    payload: base64.encode(JSON.stringify(payload)),
    signatures: [{
      protected: signData[0],
      header: {kid: key_id},
      signature: signData[2]
    }]
  }
}