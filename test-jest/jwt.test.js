var config = require('./configuration') 

test('test', ()=> {

expect(1+1).toBe(2)
})


test('Read config', ()=> {

  expect(config.JWT_BARONG_PRIVATE_KEY).toBeDefined()
  })
  