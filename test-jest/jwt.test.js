var config = require('./configuration') 

test('test', ()=> {

expect(1+1).toBe(2)
})


test('Read config', ()=> {
  console.log(config.JWT_BARONG_PRIVATE_KEY);
  expect(1+1).toBe(2)
  })
  