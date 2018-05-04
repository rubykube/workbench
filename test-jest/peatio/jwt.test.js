var config = require('../config')
var api = require('./helpers/api')
var jwtGenerator = require('./helpers/jwt/generator')

describe('Generating JWT', () => {
  test('Read config', () => {
    expect(config).toHaveProperty('PEATIO_URL')
    expect(config).toHaveProperty('JWT_TEST_USER')
    expect(config).toHaveProperty('BARONG_JWT_PRIVATE_KEY')
  })
  
  test('Generate JSON Web Token', () => {
    expect(
      jwtGenerator(config.JWT_TEST_USER)
    ).toMatch(
      /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?$/
    )
  })

  test('Try to get profile without jwt (HTTP status must be equal 401)', async () => {
    expect(() => api.get('/members/me', '123.abc.d_5'))
  })

  test('Get profile with jwt (HTTP status must be equal 200)', async () => {
    api.get('/members/me', jwtGenerator(config.JWT_TEST_USER)).then(response => {
      expect(response.status).toEqual(200)
    }).catch(err=>{done.fail(err)})
    //expect(response.data.accounts).toHaveLength(7)
  })
})