var config = require('../config')
var api = require('./helpers/api')

describe('Getting JWT from Barong', () => {
    beforeAll(() => {
        this.jwtToken = ""
        this.user = {}
    })
    
    test('Read config', () => {
        expect(config).toHaveProperty('BARONG_URL')
        expect(config).toHaveProperty('BARONG_TEST_USER')
        expect(config).toHaveProperty('BARONG_JWT_PUBLIC_KEY')
    })
    
    test('Try to get JWT from Barong with falsy blank data', async () => {

        api.post('/sessions', {}).then(response=>{
            console.log(response)
        }).catch(error=>{
            expect(error.response.status).toEqual(400)
            expect(error.response.data.error).toBeDefined() 
        })
        
    });

    test('Try to get JWT from Barong with valid data', async () => {

        const userLoginParams = config.BARONG_TEST_USER;
        api.post('/sessions', userLoginParams).then(response=>{
            expect(response.status).toEqual(201)
            expect(response.data).toBeDefined()
            this.jwtToken = response.data;
  
        })
        
    });

//   test('Generate JSON Web Token', () => {
//     expect(
//       jwtGenerator(config.JWT_TEST_USER)
//     ).toMatch(
//       /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?$/
//     )
//   })

//   test('Try to get profile without jwt (HTTP status must be equal 401)', async () => {
//     expect(() => api.get('/members/me', '123.abc.d_5'))
//   })

//   test('Get profile with jwt (HTTP status must be equal 200)', async () => {
//     const token = jwtGenerator(config.JWT_TEST_USER)
//     const response = await api.get('/members/me', token)
    
//     expect(response.status).toEqual(200)
//     expect(response.data.email).toEqual(config.JWT_TEST_USER.email)
//     expect(response.data.accounts).toHaveLength(6)
//   })
})