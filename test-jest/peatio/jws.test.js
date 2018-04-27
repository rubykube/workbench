const config = require('../config')
const management_api = require('./helpers/management_api')
const jwsSign = require('./jws/sign')

describe('Generating JWS', () => {
    test('Read config', done => {
        expect(config).toHaveProperty('MANAGEMENT_API_SIGNS')
        expect(config).toHaveProperty('JWT_TEST_USER')
        expect(config.JWT_TEST_USER).toHaveProperty('uid')
        done()
    })
    
    test('Try to get withdraws', done => {
        management_api.post('/withdraws', jwsSign({uid: config.JWT_TEST_USER.uid}, 'firstSign'), response => {
            console.log("withdraws====", response.data)
            expect(response.status).toEqual(201)
            done()
        })
    })
})