const yaml = require('js-yaml');
const fs = require('fs');

const config = require('../config')
const management_api = require('./helpers/management_api')
const jwsSign = require('./helpers/jws/sign')

jest.setTimeout(20000)

describe('MANAGEMENT API tests', () => {
    beforeAll(() => {
        // get test data from yml
        this.deposits = yaml.safeLoad(fs.readFileSync(config.TEST_DATA_DIR + 'deposits.yml', 'utf8'));
        this.withdraws = yaml.safeLoad(fs.readFileSync(config.TEST_DATA_DIR + 'withdraws.yml', 'utf8'));
    })

    test('Read config', done => {
        // control existing important data in config file
        expect(config).toHaveProperty('MANAGEMENT_API_SIGNS')
        expect(config).toHaveProperty('JWT_TEST_USER')
        expect(config.JWT_TEST_USER).toHaveProperty('uid')
        done()
    })
    
    test('Deposits testing', done => {
        // create signed doc for get existing user deposits
        const requestData = jwsSign({
            uid: config.JWT_TEST_USER.uid
        }, 'firstSign');
        management_api.post('/deposits',requestData).then(response => {
            expect(response.status).toEqual(200)
            let startCount = response.data.length
            // create new deposits from test-data
            this.deposits.map((deposit)=> {
                let signedDoc = jwsSign(deposit, 'firstSign')
                // send request to api
                management_api.post('/deposits/new',signedDoc).then(response => {
                    expect(response.status).toEqual(201)
                    expect(response.data.state).toEqual(deposit.state)
                }).catch((err)=>{
                    if (deposit.currency !== 'usd') expect(err.response.data.error).toEqual('currency does not have a valid value')
                })
            })
            setTimeout(()=>{
                // check appearing new deposit in deposits list
                management_api.post('/deposits',requestData).then(response => {
                    expect(response.status).toEqual(200)
                    if (startCount <= (100 - this.deposits.length)) {
                        expect(response.data.length).toEqual(startCount + this.deposits.length)
                    } else {
                        expect(response.data.length).toEqual(100)
                    }
                    done()
                }).catch(error=> {
                    done.fail(new Error("ERROR with get deposits"))
                })
            }, 2000)
        }).catch(error=> {
            console.log(error)
            done.fail(new Error("ERROR with get deposits"))
        })
    })

    test("Withdraws test", done => {
        // create signed doc for get existing user withdraw
        const requestData = jwsSign({
            uid: config.JWT_TEST_USER.uid
        }, 'firstSign')
        management_api.post('/withdraws',requestData).then(response => {
            let startCount = response.data.length
            expect(response.status).toEqual(200)
            // create new withdraws
            this.withdraws.map((withdraw)=>{
                let signDoc = jwsSign(withdraw, 'firstSign')
                // send request to api
                management_api.post('/withdraws/new',signDoc).then(response => {
                    expect(response.status).toEqual(201)
                    expect(response.data.state).toEqual(withdraw.state)
                }).catch((err)=>{
                    done.fail(new Error("ERROR post withdraw"))
                })
            })
            setTimeout(()=>{
                // check appearing new withdraws in withdraws list
                management_api.post('/withdraws',requestData).then(response => {
                    if (startCount <= (100 - this.withdraws.length)) {
                        expect(response.data.length).toEqual(startCount + this.withdraws.length)
                    } else {
                        expect(response.data.length).toEqual(100)
                    }
                    done()
                }).catch(error=> {
                    done.fail(new Error("ERROR with get withdraws"))
                })
            }, 2000)
        }).catch(error=> {
            done.fail(new Error("ERROR with get withdraws"))
        })
    })
})