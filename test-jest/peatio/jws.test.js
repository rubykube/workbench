const config = require('../config')
const management_api = require('./helpers/management_api')
const jwsSign = require('./helpers/jws/sign')

describe('Generating JWS', () => {
    test('Read config', done => {
        expect(config).toHaveProperty('MANAGEMENT_API_SIGNS')
        expect(config).toHaveProperty('JWT_TEST_USER')
        expect(config.JWT_TEST_USER).toHaveProperty('uid')
        done()
    })
    
    test('Try to get withdraws', done => {
        const signedDoc = jwsSign({
            exp: Math.round(new Date().getTime() / 1000) + 4 * 3600,
            sub: 'session',
            iss: 'firstSign',
            aud: [
            'peatio',
            'barong'
            ],
            data: {
                uid: config.JWT_TEST_USER.uid
            }
            
        }, 'firstSign');
        console.log(JSON.stringify(signedDoc,'  ') );
        
        management_api.post('/withdraws',signedDoc).then(response => {
            console.log("withdraws====", response.data)
            expect(response.status).toEqual(201)
            done()
        }).catch(error=> {
            console.log("ERROR", error )
        })
    })
})