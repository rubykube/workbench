var config = require('./configuration')
var jwtGenerator = require('./support/jwtGenerator');
//var getFromAPI = require('./support/getFromAPI');

test('Read config', ()=> {

  expect(config.PEATIO_URL).toBeDefined()
  expect(config.BARONG_URL).toBeDefined()
  expect(config.MULTISIGN_PRIVATE_KEY).toBeDefined()
  expect(config.JWT_BARONG_PRIVATE_KEY).toBeDefined()
  expect(config.JWT_TEST_USER).toBeDefined()

})


test('Generate JSONWebToken', ()=> {
  // generate token
  const token = jwtGenerator(config.JWT_TEST_USER, config.JWT_BARONG_PRIVATE_KEY);
  expect(token).toBeDefined();

});

// test('Try get profile without jwt', ()=> {
//   // get 
//   const data = getFromAPI(config.PEATIO_URL, config.PEATIO_API_PATH, 'members/me');
//   expect(data).toBeDefined();

// });

// test('Get profile and accounts info', () => {
//   // generate token
//   const token = jwtGenerator(config.JWT_TEST_USER, config.JWT_BARONG_PRIVATE_KEY);
// })



