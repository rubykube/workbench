const config = require('../config')
const api = require('./helpers/api')
const jwtGenerator = require('./helpers/jwt/generator')
const fs = require('fs')
const yaml = require('js-yaml')

jest.setTimeout(20000)

describe('Trading', () => {
  beforeAll(() => {
    this.accounts = []
    this.market = 'btcxrp'
    this.btcAccount = {}
    this.xrpAccount = {}
    this.orderAmount = 0.0001
    this.orders = []
    this.ordersForClose = {
      sell: {side: 'sell', volume: 0, price: 0},
      buy: {side: 'buy', volume: 0, price: 0}
    }
  })
  
  test('Clear order book', done => {
    // Clear order book (/api/v2/orders/clear) - sell and buy
    api.post(`/orders/clear`, {side: 'sell'}, jwtGenerator(config.JWT_TEST_USER)).then(response => {
      expect(response.status).toEqual(201)
      api.post(`/orders/clear`, {side: 'buy'}, jwtGenerator(config.JWT_TEST_USER)).then(response => {
        expect(response.status).toEqual(201)
        done()
      })
    })
  })

  test('Check BTC && XRP balance', done => {
    const expectedObject = {
      sn: expect.any(String),
      email: 'admin@etorox.io',
      accounts: expect.arrayContaining(
        [{
          currency: expect.any(String),
          balance: expect.any(String),
          locked: expect.any(String)
        }]
      )
    }
    setTimeout(()=>{
      api.get('/members/me', jwtGenerator(config.JWT_TEST_USER)).then(response => {
        expect(response.status).toEqual(200)
        expect(response.data).toEqual(expect.objectContaining(expectedObject))
        this.accounts = response.data.accounts.map(a => {
          a.balance = Number(a.balance)
          a.locked = Number(a.locked)
          return a
        })
        this.btcAccount = this.accounts.find(a => a.currency === 'btc')
        // expect(
        //   this.btcAccount.balance
        // ).toBeGreaterThan(0)
  
        this.xrpAccount = this.accounts.find(a => a.currency === 'xrp')
        // expect(
        //   this.xrpAccount.balance
        // ).toBeGreaterThan(0)
  
        done()
      }).catch(err=>{
        console.log("ERROR", err)
      })
    }, 1000)
  })

  test('get depth for market and clearing order book', done => {
    setTimeout(() => {
      // Get depth of specified market
      api.get(`/depth?market=${this.market}`, jwtGenerator(config.JWT_TEST_USER)).then(response => {
        console.log("DEPTH", response.data)
        expect(response.status).toEqual(200)
        // check response data structure
        expect(response.data).toEqual(expect.objectContaining({
          timestamp: expect.any(Number),
          asks: expect.any(Object),
          bids: expect.any(Object)
        }))
        if ((response.data.asks.length + response.data.bids.length)>0) {
          if (response.data.asks.length > 0) {
            expect(response.data.asks).toEqual(expect.arrayContaining(expectedArray))
          }
          if (response.data.bids.length > 0) {
            expect(response.data.bids).toEqual(expect.arrayContaining(expectedArray))
          }
          // calculate clearing orders (this.ordersForClose)
          response.data.bids.map((bid) => {
            this.ordersForClose.sell.volume += Number(bid[1])
            if (this.ordersForClose.sell.price == 0) {
              this.ordersForClose.sell.price = Number(bid[0])
            } else if (this.ordersForClose.sell.price > Number(bid[0])) {
              this.ordersForClose.sell.price = Number(bid[0])
            }
          })
          response.data.asks.map((ask) => {
            this.ordersForClose.buy.volume += Number(ask[1])
            if (this.ordersForClose.buy.price == 0) {
              this.ordersForClose.buy.price = Number(ask[0])
            } else if (this.ordersForClose.buy.price < Number(ask[0])) {
              this.ordersForClose.buy.price = Number(ask[0])
            }
          })
          this.ordersForClose.sell.volume = Math.round(this.ordersForClose.sell.volume * 1e12) / 1e12
          this.ordersForClose.sell.price = Math.round(this.ordersForClose.sell.price * 1e12) / 1e12
          this.ordersForClose.buy.volume = Math.round(this.ordersForClose.buy.volume * 1e12) / 1e12
          this.ordersForClose.buy.price = Math.round(this.ordersForClose.buy.price * 1e12) / 1e12
          let clearing = []
          if (this.ordersForClose.sell.volume) clearing.push(this.ordersForClose.sell)
          if (this.ordersForClose.buy.volume) clearing.push(this.ordersForClose.buy)
          // if clearing need
          if (clearing.length>0) {
            // this is check not need without manual qa
            if ((this.btcAccount.balance>(this.ordersForClose.buy.volume)) && (this.xrpAccount.balance>(this.ordersForClose.sell.volume*this.ordersForClose.sell.price))) {
              // post clearing orders
              api.post('/orders/multi', {market: this.market, orders: clearing}, jwtGenerator(config.JWT_TEST_USER)).then(response => {
                done()
              })
            } else {
              done()
            }
          } else {
            done()
          }
        } else {
          done()
        }
      }).catch(err=>{
        console.log("ERROR", err.response.data)
      })
    }, 2000)
  })

  test('create trading orders (multi and single) and check trading result', done => {
    const orders = {
      // set orders for create depth
      multi: {
        market: this.market,
        orders: [
          {side: 'sell',volume: this.orderAmount * 2, price: 20},
          {side: 'sell',volume: this.orderAmount,     price: 20.5},
          {side: 'sell',volume: this.orderAmount * 1, price: 19},
          {side: 'buy', volume: this.orderAmount,     price: 18.3},
          {side: 'buy', volume: this.orderAmount * 1, price: 18.4},
          {side: 'buy', volume: this.orderAmount,     price: 18.35}
        ]
      },
      // set order for buy
      singleBuy: {
        market: this.market,
        side: 'buy',
        volume: this.orderAmount * 2,
        price: 20.5
      },
      // set order for sell
      singleSell: {
        market: this.market,
        side: 'sell',
        volume: this.orderAmount * 2,
        price: 18.34
      }
    },
    expectedArray = [{
      id: expect.any(Number),
      side: expect.any(String),
      ord_type: 'limit',
      price: expect.any(String),
      avg_price: expect.any(String),
      state: 'wait',
      market: this.market,
      created_at: expect.any(String),
      volume: expect.any(String),
      remaining_volume: expect.any(String),
      executed_volume: expect.any(String),
      trades_count: expect.any(Number)
    }],
    expectedObject = {
      ...orders.single,
      id: expect.any(Number),
      ord_type: 'limit',
      avg_price: expect.any(String),
      price: expect.any(String),
      volume: expect.any(String),
      state: 'wait',
      created_at: expect.any(String),
      avg_price: expect.any(String),
      executed_volume: expect.any(String),
      trades_count: expect.any(Number)
    },
    expectedMember = {
      sn: expect.any(String),
      email: 'admin@etorox.io',
      accounts: expect.arrayContaining(
        [{
          currency: expect.any(String),
          balance: expect.any(String),
          locked: expect.any(String)
        }]
      )
    }
    setTimeout(()=>{
      // send orders for depth
      api.post('/orders/multi', orders.multi, jwtGenerator(config.JWT_TEST_USER)).then(response => {
        expect(response.status).toEqual(201)
        if (this.btcAccount.balance + this.xrpAccount.balance > 0) {
          expect(response.data).toEqual(expect.arrayContaining(expectedArray))
          setTimeout(()=>{
            api.get('/members/me', jwtGenerator(config.JWT_TEST_USER)).then(resp => {
              expect(resp.status).toEqual(200)
              this.accounts = resp.data.accounts.map(a => {
                a.balance = Number(a.balance)
                a.locked = Number(a.locked)
                return a
              })
              this.btcAccount = this.accounts.find(a => a.currency === 'btc')
              this.xrpAccount = this.accounts.find(a => a.currency === 'xrp')
              // get depth
              api.get(`/depth?market=${this.market}`, jwtGenerator(config.JWT_TEST_USER)).then(response => {
                this.depth = response.data
                // send orders for checking
                api.post('/orders', orders.singleSell, jwtGenerator(config.JWT_TEST_USER)).then(response => {
                  this.orders.push(response.data)
                  api.post('/orders', orders.singleBuy, jwtGenerator(config.JWT_TEST_USER)).then(response => {
                    this.orders.push(response.data)
                    // start calculate check data
                    setTimeout(()=>{
                      api.get('/members/me', jwtGenerator(config.JWT_TEST_USER)).then(resp => {
                        let accounts = resp.data.accounts.map(a => {
                          a.balance = Number(a.balance)
                          a.locked = Number(a.locked)
                          return a
                        })
                        let btcAccount = accounts.find(a => a.currency === 'btc')
                        let xrpAccount = accounts.find(a => a.currency === 'xrp')
                        let sellOrder = this.orders.find((order)=>{return order.side=="sell"})
                        let buyOrder = this.orders.find((order)=>{return order.side=="buy"})
                        let asks = this.depth.asks,
                            bids = this.depth.bids,
                            s_minPrice = 0,
                            s_executed_volume = 0,
                            s_funds = 0,
                            b_maxPrice = 0,
                            b_executed_volume = 0,
                            b_funds = 0
                        // get buy order after matching
                        api.get(`/order?id=${buyOrder.id}`, jwtGenerator(config.JWT_TEST_USER)).then(response => {
                          expect(response.status).toEqual(200)
                          let result = response.data
                          let i = asks.length
                          // calculate average price
                          while (i--) {
                            if (Number(result.volume) != Number(s_executed_volume)) {
                              if ((result.volume - s_executed_volume) <= asks[i][1]) {
                                s_funds += Number(result.volume - s_executed_volume) * Number(asks[i][0])
                                s_executed_volume += Number((result.volume - s_executed_volume))
                                i = 0
                              } else {
                                s_funds += Number(asks[i][1]) * Number(asks[i][0])
                                s_executed_volume += Number(asks[i][1])
                              }
                            }
                          }
                          let avg_price = Math.round(s_funds/s_executed_volume * 1e12) / 1e12
                          // check average price
                          expect(Number(result.avg_price)).toEqual(avg_price)
                          // get sell order after matching
                          api.get(`/order?id=${sellOrder.id}`, jwtGenerator(config.JWT_TEST_USER)).then(response => {
                            expect(response.status).toEqual(200)
                            let result = response.data
                            let i = 0,
                              maxI = bids.length
                            // calculate average price
                            while (i < maxI) {
                              if (Number(result.volume) != Number(b_executed_volume)) {
                                if ((result.volume - b_executed_volume) <= bids[i][1]) {
                                  b_funds += Number(result.volume - b_executed_volume) * Number(bids[i][0])
                                  b_executed_volume += Number((result.volume - b_executed_volume))
                                  i = 0
                                } else {
                                  b_funds += Number(bids[i][1]) * Number(bids[i][0])
                                  b_executed_volume += Number(bids[i][1])
                                }
                              }
                              i++
                            }
                            let avg_price = Math.round(b_funds/b_executed_volume * 1e12) / 1e12
                            // check average price
                            expect(Number(result.avg_price)).toEqual(avg_price)
                            done()
                          })
                        })
                      })
                    }, 2000)
                  })
                })
              })
            })
          }, 2500)
        } else {
          done()
        }
      })
    }, 4500)
  })
})