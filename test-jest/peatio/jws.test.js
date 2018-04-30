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
        // control existing data in config
        expect(config).toHaveProperty('MANAGEMENT_API_SIGNS')
        expect(config).toHaveProperty('JWT_TEST_USER')
        expect(config.JWT_TEST_USER).toHaveProperty('uid')
        done()
    })
    
    test('Try to get fiat deposits', done => {
        // create request users deposits and sign it
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
        // create request for add deposit and sign it
        let signedDoc = jwsSign({
            uid: config.JWT_TEST_USER.uid,
            currency: 'usd',
            amount: 100,
            state: "accepted"
        }, 'firstSign')
        management_api.post('/deposits/new',signedDoc).then(response => {
            this.deposits.added.push(response.data)
            expect(response.status).toEqual(201)
            expect(response.data.state).toEqual('accepted')
            let requestData = jwsSign({
                uid: config.JWT_TEST_USER.uid
            }, 'firstSign')
            // get deposits list and check added deposit
            management_api.post('/deposits',requestData).then(response => {
                this.deposits.result = response.data
                expect(this.deposits.result.length - this.deposits.start.length).toEqual(this.deposits.added.length)
                done()
            }).catch(error=> {
                console.log("ERROR", error)
            })
        }).catch(error=> {
            console.log("ERROR", error)
        })
    })

    test("Withdraws test", done => {
        // create request users withdraws and sign it
        let requestData = jwsSign({
            uid: config.JWT_TEST_USER.uid
        }, 'firstSign')
        management_api.post('/withdraws',requestData).then(response => {
            this.withdraws.start = response.data
            expect(response.status).toEqual(200)
            // create request for add withdraw and sign it
            let withdrawSign = jwsSign({
                uid: config.JWT_TEST_USER.uid,
                rid: config.JWT_TEST_USER.uid,
                currency: 'usd',
                amount: 1,
                state: "submitted"
            }, 'firstSign')
            management_api.post('/withdraws/new',withdrawSign).then(response => {
                console.log("RESULT", response.data)
                this.withdraws.added.push(response.data)
                expect(response.status).toEqual(201)
                expect(response.data.state).toEqual('submitted')
                // get withdraws list and check added withdraw
                management_api.post('/withdraws',requestData).then(response => {
                    this.withdraws.result = response.data
                    expect(this.withdraws.result.length - this.withdraws.start.length).toEqual(this.withdraws.added.length)
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