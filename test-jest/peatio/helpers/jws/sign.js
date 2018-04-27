const jsonwebtoken = require('jsonwebtoken')
const base64 = require('base-64')
const config = require('../../../config')

module.exports = (payload, key_id) => {
  let pem = base64.decode(config.MANAGEMENT_API_SIGNS[key_id].private_key)
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