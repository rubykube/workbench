

const config = {
  PEATIO_URL: process.env["PEATIO_DOMAIN"],
  BARONG_URL: process.env["BARONG_DOMAIN"],

  PEATIO_API_PATH: '/api/v2',
  PEATIO_MANAGEMENT_API_PATH: '/management_api/v1',
  BARONG_API_PATH: '/api/v1',
  
  MULTISIGN_PRIVATE_KEY : process.env["MULTISIGN_PRIVATE_KEY"],
  JWT_BARONG_PRIVATE_KEY: process.env["JWT_BARONG_PRIVATE_KEY"],

  JWT_TEST_USER: {
    "email": "admin@barong.io",
    "iat": Math.round(new Date().getTime()/1000)-1,
    "exp": Math.round(new Date().getTime()/1000) + 4*3600,
    "sub": "session",
    "iss": "barong",
    "jti": "123kdslfvmevfnw3n4gf3",
    "aud": ["peatio"],
    "level": 3,
    "uid": "ID123123",
    "state": "approved"
  }
}

module.exports = config;
