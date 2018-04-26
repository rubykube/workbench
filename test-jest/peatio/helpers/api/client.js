const axios = require('axios')
const config = require('../../../config')

const apiClient = axios.create({
  baseURL: config.PEATIO_URL
})

module.exports = {
  get: (endpoint, jwt) => apiClient.get(endpoint, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  }),

  post: (endpoint, params, jwt) => apiClient.post(endpoint, params, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  })
}