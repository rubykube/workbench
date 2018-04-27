const axios = require('axios')
const config = require('../../../config')

const apiClient = axios.create({
  baseURL: config.PEATIO_MANAGEMENT_URL
})

module.exports = {
    post: (endpoint, params) => apiClient.post(endpoint, params, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
}