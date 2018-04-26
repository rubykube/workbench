const jsonwebtoken = require('jsonwebtoken')
const config = require('../../../config')

module.exports = payload => jsonwebtoken.sign(
  payload,
  config.BARONG_JWT_PRIVATE_KEY, {
    algorithm: 'RS256'
  }
)