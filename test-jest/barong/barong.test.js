var config = require('../configuration')
var jwtGenerator = require('../support/jwtGenerator');
var postToAPI = require('../support/postToAPI');

//jest.setTimeout(10000);

test('Read Barong config', ()=> {

  expect(config.BARONG_URL).toBeDefined()
  expect(config.BARONG_API_PATH).toBeDefined()

})

it('Try falsy get JWT from Barong (no password)', async () => {
    // request GET peatio api /members/me without JWT
    const data = await postToAPI(config.BARONG_URL, config.BARONG_API_PATH, '/session');
    expect(data).toEqual(401);
  });
  
