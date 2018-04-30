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
        this.withdraws = {
            start: [],
            added: [],
            result: []
        }
    })

    test('Read config', done => {
        // control existing important data in config file
        expect(config).toHaveProperty('MANAGEMENT_API_SIGNS')
        expect(config).toHaveProperty('JWT_TEST_USER')
        expect(config.JWT_TEST_USER).toHaveProperty('uid')
        done()
    })
    
    test('Try to get fiat deposits', done => {
        // create signed doc for get existing user deposits
        const signedDoc = jwsSign({
            uid: config.JWT_TEST_USER.uid
        }, 'firstSign');
        
        management_api.post('/deposits',signedDoc).then(response => {
            this.deposits.start = response.data
            expect(response.status).toEqual(200)
            done()
        }).catch(error=> {
            console.log("ERROR", error)
        })
    })

    test('Fiat deposit', done => {
        // create new deposit accepted request and sign it
        let signedDoc = jwsSign({
            uid: config.JWT_TEST_USER.uid,
            currency: 'usd',
            amount: 100,
            state: "accepted"
        }, 'firstSign')
        // send request to api
        management_api.post('/deposits/new',signedDoc).then(response => {
            this.deposits.added.push(response.data)
            expect(response.status).toEqual(201)
            expect(response.data.state).toEqual('accepted')
            let requestData = jwsSign({
                uid: config.JWT_TEST_USER.uid
            }, 'firstSign')
            // check appearing new deposit in deposits list
            management_api.post('/deposits',requestData).then(response => {
                this.deposits.result = response.data
                expect(this.deposits.result[0].tid).toEqual(this.deposits.added[0].tid)
                done()
            }).catch(error=> {
                console.log("ERROR", error)
            })
        }).catch(error=> {
            console.log("ERROR", error)
        })
    })

    test("Withdraws test", done => {
        // create signed doc for get existing user withdraw
        let requestData = jwsSign({
            uid: config.JWT_TEST_USER.uid
        }, 'firstSign')
        management_api.post('/withdraws',requestData).then(response => {
            this.withdraws.start = response.data
            expect(response.status).toEqual(200)
            // create new withdraw submitted request and sign it
            let withdrawSign = jwsSign({
                uid: config.JWT_TEST_USER.uid,
                rid: config.JWT_TEST_USER.uid,
                currency: 'usd',
                amount: 1,
                state: "submitted"
            }, 'firstSign')
            // send request to api
            management_api.post('/withdraws/new',withdrawSign).then(response => {
                console.log("RESULT", response.data)
                this.withdraws.added.push(response.data)
                expect(response.status).toEqual(201)
                expect(response.data.state).toEqual('submitted')
                // check appearing new withdraw in withdraws list
                management_api.post('/withdraws',requestData).then(response => {
                    this.withdraws.result = response.data
                    expect(this.withdraws.result[0].tid).toEqual(this.withdraws.added[0].tid)
                    done()
                }).catch(error=> {
                    console.log("ERROR", error)
                })
            }).catch(error=> {
                console.log("ERROR", error)
            })
        }).catch(error=> {
            console.log("ERROR", error)
        })
    })
})