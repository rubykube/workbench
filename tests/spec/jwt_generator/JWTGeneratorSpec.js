const base64 = require('base-64');
const jsonwebtoken = require('jsonwebtoken');


describe("JWT Generator", function() {

  const config = require('../../configuration');
  // We will store configuration for JWT generation
  /**
    const token = JWT.sign(payload, privateKey, {algorithm: “RS256”})
   */
  let JWT_TEST_PRIVATE_KEY,
      JWT_PRIVATE_PEM,
      JWT_TEST_USER,
      JWT_GENERATED_TOKEN;


  beforeEach(function() {
    // Setting variables
    JWT_TEST_PRIVATE_KEY = config.JWT_TEST_PRIVATE_KEY;
    JWT_TEST_USER = config.JWT_TEST_USER;
    JWT_PRIVATE_PEM = base64.decode(JWT_TEST_PRIVATE_KEY);
  });

  it("should be able to get configuration for token generation", function() {
    expect(JWT_TEST_PRIVATE_KEY).toEqual(jasmine.any(String));

  });

  describe("shared examples for group state", function() {
    it("JWT_TEST_PRIVATE_KEY should be base-64 encoded", function(){
      console.log(JWT_PRIVATE_PEM)
      expect(JWT_PRIVATE_PEM).toEqual(jasmine.any(String));

      JWT_GENERATED_TOKEN = jsonwebtoken.sign(JWT_TEST_USER, JWT_PRIVATE_PEM, {algorithm: "RS256"});

      console.log(JWT_GENERATED_TOKEN);

    })
  });

});
