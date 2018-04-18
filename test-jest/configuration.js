

const config = {
  MULTISIGN_PRIVATE_KEY : process.env["MULTISIGN_PRIVATE_KEY"],
  JWT_BARONG_PRIVATE_KEY: process.env["JWT_TEST_BARONG_KEY"],

  JWT_TEST_USER: {
    "email": "admin@barong.io",
    "iat": Math.round(new Date().getTime()/1000),
    "exp": Math.round(new Date().getTime()/1000) + 4*3600,
    "sub": "session",
    "aud": ["peatio"],
    "level": 3,
    "uid": "ID123123",
    "state": "approved"
  }
}

module.exports = config;
