var config = require('../configuration')
var jwtGenerator = require('../support/jwtGenerator');
var requestAPI = require('../support/requestAPI');

//jest.setTimeout(10000);

test('Read config', ()=> {

  expect(config.PEATIO_URL).toBeDefined()
  expect(config.BARONG_URL).toBeDefined()
  expect(config.MULTISIGN_PRIVATE_KEY).toBeDefined()
  expect(config.JWT_BARONG_PRIVATE_KEY).toBeDefined()
  expect(config.JWT_TEST_USER).toBeDefined()
  expect(config.PEATIO_API_PATH).toBeDefined()

})


test('Generate JSONWebToken', ()=> {
  // generate token
  const token = jwtGenerator(config.JWT_TEST_USER, config.JWT_BARONG_PRIVATE_KEY);
  console.log("Generated JWT:");
  console.log(token)
  expect(token).toBeDefined();

  

});

it('Try get profile without jwt (HTTP status must be equal 401)', async () => {
  // request GET peatio api /members/me without JWT
  const data = await requestAPI("GET", config.PEATIO_API_PATH, '/members/me', "", "");
  expect(data.status).toEqual(401);
});

it('Get profile with jwt (HTTP status must be equal 200)', async () => {
  // generate token
  const token = jwtGenerator(config.JWT_TEST_USER, config.JWT_BARONG_PRIVATE_KEY);
  // request GET peatio api /members/me
  const data = await requestAPI("GET", config.PEATIO_API_PATH, '/members/me', token, "");
  // data = {data: response data, status: HTTP status code}
  expect(data.status).toEqual(200);
});

it('Clear all my orders (HTTP status must be equal 201)', async () => {
  // generate token
  const token = jwtGenerator(config.JWT_TEST_USER, config.JWT_BARONG_PRIVATE_KEY);
  // request POST peatio api /orders/clear
  const data = await requestAPI("POST", config.PEATIO_API_PATH, '/orders/clear', token, "");
  // data = {data: response data, status: HTTP status code}
  expect(data.status).toEqual(201);
});