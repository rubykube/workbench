const axios = require('axios')
const config = require('../../config')

const apiClient = axios.create({
  baseURL: config.BARONG_URL
})

module.exports = {
    get: (endpoint, jwt) => {
        let headers = jwt ? {
            Authorization: `Bearer ${jwt}`
            }: null ; 
        return  apiClient.get(endpoint, { headers })
    },

    post: (endpoint, params, jwt) => {
        let headers = jwt ? {
            headers: {
                Authorization: `Bearer ${jwt}`
                }
            }
            : {}; 

        return apiClient.post(endpoint, params, headers)
    }
    
    
}