var config = require('./configuration')
var jwtGenerator = require('./support/jwtGenerator');
var getFromAPI = require('./support/getFromAPI');

//jest.setTimeout(10000);

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

// async/await can be used.
it('Try get profile without jwt (HTTP status must be equal 401)', async () => {
  // request GET peatio api /members/me without JWT
  const data = await getFromAPI(config.PEATIO_URL, config.PEATIO_API_PATH, '/members/me');
  expect(data).toEqual(401);
});

// async/await can be used.
it('Get profile with jwt (HTTP status must be equal 200)', async () => {
  // generate token
  const token = jwtGenerator(config.JWT_TEST_USER, config.JWT_BARONG_PRIVATE_KEY);
  // request GET peatio api /members/me
  const data = await getFromAPI(config.PEATIO_URL, config.PEATIO_API_PATH, '/members/me', token);
  expect(data).toEqual(200);
});


