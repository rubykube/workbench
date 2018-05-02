const config = require('../config')
const api = require('./helpers/api')
const jwtGenerator = require('./helpers/jwt/generator')
const fs = require('fs')
const yaml = require('js-yaml')

jest.setTimeout(20000)

describe('Trading', () => {
  beforeAll(() => {
    this.accounts = []
    this.marketName = 'USD/EUR'
    this.marketId = ""
    this.usdAccount = {}
    this.eurAccount = {}
    this.ordersForClose = {
      sell: {side: 'sell', volume: 0, price: 0},
      buy: {side: 'buy', volume: 0, price: 0}
    }
    this.orders = []
    this.testData = yaml.safeLoad(fs.readFileSync(config.TEST_DATA_DIR + 'orders.yml', 'utf8'))
  })
  
  test('Clear order book', done => {
    // Clear order book (/api/v2/orders/clear)
    api.post(`/orders/clear`, {}, jwtGenerator(config.JWT_TEST_USER)).then(response => {
      expect(response.status).toEqual(201)
      done()
    }).catch(err=>{
      done.fail(new Error("Clear Order book ERROR"))
    })
  })

  test('Get markets', done => {
    // Get markets (/api/v2/markets)
    api.get(`/markets`).then(response => {
      expect(response.status).toEqual(200)
      this.marketId = response.data.find(market=>{
        return (market.name === this.marketName)
      }).id
      done()
    }).catch(err=>{
      done.fail(new Error("GET MARKET Error"))
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
      // get profile data
      api.get('/members/me', jwtGenerator(config.JWT_TEST_USER)).then(response => {
        expect(response.status).toEqual(200)
        expect(response.data).toEqual(expect.objectContaining(expectedObject))
        // remap accounts
        this.accounts = response.data.accounts.map(a => {
          a.balance = Number(a.balance)
          a.locked = Number(a.locked)
          return a
        })
        console.log("INITIAL BALANCES", this.accounts)
        this.usdAccount = this.accounts.find(a => a.currency === 'usd')
        expect(
          this.usdAccount.balance
        ).toBeGreaterThan(0)
  
        this.eurAccount = this.accounts.find(a => a.currency === 'eur')
        expect(
          this.eurAccount.balance
        ).toBeGreaterThan(0)
  
        done()
      }).catch(err=>{
        done.fail(new Error("GET PROFILE DATA Error"))
      })
    }, 1000)
  })

  test('get depth for market and clearing order book', done => {
    setTimeout(() => {
      // Get depth of specified market
      api.get(`/depth?market=${this.marketId}`, jwtGenerator(config.JWT_TEST_USER)).then(response => {
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
              api.post('/orders/multi', {market: this.marketId, orders: clearing}, jwtGenerator(config.JWT_TEST_USER)).then(response => {
                done()
              }).catch(err=>{
                done.fail(new Error("ORDERS MULTI CLEARING Error"))
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
        done.fail(new Error("GET MARKET DEPTH Error"))
      })
    }, 2000)
  })

  // test('create trading orders (multi and single) and check trading result', done => {
  //   const orders = {
  //     // set orders for create depth
  //     market: this.marketId,
  //     orders: this.testData.find(data=>{
  //       return (data.id === 'multi')
  //     }).orders
  //   }
  //   // set order for buy
  //   let buyOrder = this.testData.find(data=>{
  //     return (data.id === 'buy')
  //   }).order,
  //   singleBuy = {
  //     ...buyOrder,
  //     market: this.marketId,
  //   },
  //   sellOrder = this.testData.find(data=>{
  //     return (data.id === 'sell')
  //   }).order,
  //   singleSell = {
  //     ...sellOrder,
  //     market: this.marketId
  //   }
  //   const expectedArray = [{
  //     id: expect.any(Number),
  //     side: expect.any(String),
  //     ord_type: 'limit',
  //     price: expect.any(String),
  //     avg_price: expect.any(String),
  //     state: 'wait',
  //     market: this.marketId,
  //     created_at: expect.any(String),
  //     volume: expect.any(String),
  //     remaining_volume: expect.any(String),
  //     executed_volume: expect.any(String),
  //     trades_count: expect.any(Number)
  //   }],
  //   expectedObject = {
  //     ...orders.single,
  //     id: expect.any(Number),
  //     ord_type: 'limit',
  //     avg_price: expect.any(String),
  //     price: expect.any(String),
  //     volume: expect.any(String),
  //     state: 'wait',
  //     created_at: expect.any(String),
  //     avg_price: expect.any(String),
  //     executed_volume: expect.any(String),
  //     trades_count: expect.any(Number)
  //   },
  //   expectedMember = {
  //     sn: expect.any(String),
  //     email: 'admin@etorox.io',
  //     accounts: expect.arrayContaining(
  //       [{
  //         currency: expect.any(String),
  //         balance: expect.any(String),
  //         locked: expect.any(String)
  //       }]
  //     )
  //   }
  //   setTimeout(()=>{
  //     // send orders for depth
  //     api.post('/orders/multi', orders, jwtGenerator(config.JWT_TEST_USER)).then(response => {
  //       expect(response.status).toEqual(201)
  //       if (this.usdAccount.balance + this.eurAccount.balance > 0) {
  //         expect(response.data).toEqual(expect.arrayContaining(expectedArray))
  //         setTimeout(()=>{
  //           api.get('/members/me', jwtGenerator(config.JWT_TEST_USER)).then(resp => {
  //             expect(resp.status).toEqual(200)
  //             this.accounts = resp.data.accounts.map(a => {
  //               a.balance = Number(a.balance)
  //               a.locked = Number(a.locked)
  //               return a
  //             })
  //             this.usdAccount = this.accounts.find(a => a.currency === 'usd')
  //             this.eurAccount = this.accounts.find(a => a.currency === 'eur')
  //             // get depth
  //             api.get(`/depth?market=${this.marketId}`, jwtGenerator(config.JWT_TEST_USER)).then(response => {
  //               this.depth = response.data
  //               // send orders for checking
  //               api.post('/orders', singleSell, jwtGenerator(config.JWT_TEST_USER)).then(response => {
  //                 this.orders.push(response.data)
  //                 api.post('/orders', singleBuy, jwtGenerator(config.JWT_TEST_USER)).then(response => {
  //                   this.orders.push(response.data)
  //                   // start calculate check data
  //                   setTimeout(()=>{
  //                     api.get('/members/me', jwtGenerator(config.JWT_TEST_USER)).then(resp => {
  //                       let accounts = resp.data.accounts.map(a => {
  //                         a.balance = Number(a.balance)
  //                         a.locked = Number(a.locked)
  //                         return a
  //                       })
  //                       let usdAccount = accounts.find(a => a.currency === 'usd')
  //                       let eurAccount = accounts.find(a => a.currency === 'eur')
  //                       let sellOrder = this.orders.find((order)=>{return order.side=="sell"})
  //                       let buyOrder = this.orders.find((order)=>{return order.side=="buy"})
  //                       let asks = this.depth.asks,
  //                           bids = this.depth.bids,
  //                           s_minPrice = 0,
  //                           s_executed_volume = 0,
  //                           s_funds = 0,
  //                           b_maxPrice = 0,
  //                           b_executed_volume = 0,
  //                           b_funds = 0
  //                       // get buy order after matching
  //                       api.get(`/order?id=${buyOrder.id}`, jwtGenerator(config.JWT_TEST_USER)).then(response => {
  //                         expect(response.status).toEqual(200)
  //                         let result = response.data
  //                         let i = asks.length
  //                         // calculate average price
  //                         while (i--) {
  //                           if (Number(result.volume) != Number(s_executed_volume)) {
  //                             if ((result.volume - s_executed_volume) <= asks[i][1]) {
  //                               s_funds += Number(result.volume - s_executed_volume) * Number(asks[i][0])
  //                               s_executed_volume += Number((result.volume - s_executed_volume))
  //                               i = 0
  //                             } else {
  //                               s_funds += Number(asks[i][1]) * Number(asks[i][0])
  //                               s_executed_volume += Number(asks[i][1])
  //                             }
  //                           }
  //                         }
  //                         let avg_price = Math.round(s_funds/s_executed_volume * 1e12) / 1e12
  //                         // check average price
  //                         expect(Number(result.avg_price)).toEqual(avg_price)
  //                         // get sell order after matching
  //                         api.get(`/order?id=${sellOrder.id}`, jwtGenerator(config.JWT_TEST_USER)).then(response => {
  //                           expect(response.status).toEqual(200)
  //                           let result = response.data
  //                           let i = 0,
  //                             maxI = bids.length
  //                           // calculate average price
  //                           while (i < maxI) {
  //                             if (Number(result.volume) != Number(b_executed_volume)) {
  //                               if ((result.volume - b_executed_volume) <= bids[i][1]) {
  //                                 b_funds += Number(result.volume - b_executed_volume) * Number(bids[i][0])
  //                                 b_executed_volume += Number((result.volume - b_executed_volume))
  //                                 i = 0
  //                               } else {
  //                                 b_funds += Number(bids[i][1]) * Number(bids[i][0])
  //                                 b_executed_volume += Number(bids[i][1])
  //                               }
  //                             }
  //                             i++
  //                           }
  //                           let avg_price = Math.round(b_funds/b_executed_volume * 1e12) / 1e12
  //                           // check average price
  //                           expect(Number(result.avg_price)).toEqual(avg_price)
  //                           done()
  //                         }).catch(err=>{
  //                           done.fail(new Error("GET sell Order result Error"))
  //                         })
  //                       }).catch(err=>{done.fail(new Error('Get order buy result Error'))})
  //                     }).catch(err=>{done.fail(new Error('Get profile data 1 Error'))})
  //                   }, 2000)
  //                 }).catch(err=>{done.fail(new Error('Single buy post Error'))})
  //               }).catch(err=>{done.fail(new Error('Single sell post Error'))})
  //             }).catch(err=>{done.fail(new Error('get depth Error'))})
  //           }).catch(err=>{done.fail(new Error('get profile data Error'))})
  //         }, 2500)
  //       } else {
  //         done()
  //       }
  //     }).catch(err=>{
  //         done.fail(new Error("multi orders send Error"))
  //     })
  //   }, 4500)
  // })
})