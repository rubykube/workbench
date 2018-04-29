const config = require('../config')
const management_api = require('./helpers/management_api')
const jwsSign = require('./helpers/jws/sign')

describe('deposit tests', () => {
    beforeAll(() => {
        this.deposits = {
            start: [],
            added: [],
            result: []
        }
    })

    test('Read config', done => {
        expect(config).toHaveProperty('MANAGEMENT_API_SIGNS')
        expect(config).toHaveProperty('JWT_TEST_USER')
        expect(config.JWT_TEST_USER).toHaveProperty('uid')
        done()
    })
    
    test('Try to get fiat deposits', done => {
        const signedDoc = jwsSign({
            exp: Math.round(new Date().getTime() / 1000) + 4 * 3600,
            sub: 'multisign',
            aud: [
            'peatio',
            'barong'
            ],
            uid: config.JWT_TEST_USER.uid
            
        }, 'firstSign');
        
        management_api.post('/deposits',signedDoc).then(response => {
            this.deposits.start = response.data
            console.log("START deposits", response.data)
            expect(response.status).toEqual(200)
            done()
        }).catch(error=> {
            console.log("ERROR", error)
        })
    })

    test('Fiat deposit', done => {
        let signedDoc = jwsSign({
            exp: Math.round(new Date().getTime() / 1000) + 4 * 3600,
            sub: 'multisign',
            aud: [
            'peatio',
            'barong'
            ],
            uid: config.JWT_TEST_USER.uid,
            currency: 'usd',
            amount: 100,
            status: "accepted"
        }, 'firstSign')
        management_api.post('/deposits/new',signedDoc).then(response => {
            this.deposits.added.push(response.data)
            console.log("ADD deposits", response.data)
            expect(response.status).toEqual(201)
            let requestData = jwsSign({
                exp: Math.round(new Date().getTime() / 1000) + 4 * 3600,
                sub: 'multisign',
                aud: [
                'peatio',
                'barong'
                ],
                uid: config.JWT_TEST_USER.uid
            }, 'firstSign')
            management_api.post('/deposits',requestData).then(response => {
                this.deposits.result = response.data
                console.log("Result deposits", response.data)
                expect(response.status).toEqual(200)
                done()
            }).catch(error=> {
                console.log("ERROR", error)
            })
        }).catch(error=> {
            console.log("ERROR", error)
        })
    })
})