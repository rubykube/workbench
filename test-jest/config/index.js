const fs = require('fs')
const base64 = require('base-64')

module.exports = {
  PEATIO_URL: process.env["PEATIO_API_URL"] || 'https://platform.qa.etorox.io/api/v2/',
  PEATIO_MANAGEMENT_URL: process.env["PEATIO_MANAGEMENT_API_URL"] || 'https://platform.qa.etorox.io/management_api/v1',
  
  MANAGEMENT_API_SIGNS: {
    "firstSign": {
      algorithm: "RS256",
      private_key: "LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb2dJQkFBS0NBUUVBOWt6akVBb2NJSWZva3hhSTZHMXMwRzczWnlyWXVOcWtnaVR2ek9haGRoSE9FUWFJCmpEY3EvRzVuSW5Ic25qdkZMM3oyY2tkTFBURWh3VE5HNlEybkZ2TkRTQlJHSVRJSFVGaW1KM2NBTTlzYzl2NzYKaE9vUDh5NUd4RHllMjcwWjE4UWFjOEdkMGZyZGZ6Z1lvQ3BTWk1yK3c5ZFRIU0dpcXczaW9YUjJ5akNSZm5XTgp1NXM4dGJaL0s4aFpUYUx5cUs1Znd6UTJrR3F4dVl1YnRuRlpOYUhmN2ZNL09IOXZETG1MNi9yczhPWURiaUhQCjFvVkFJUVliZEZpNU4zZlJhcnJQdGRrMGlsZ2VNb0Z3YmlidDg1Z2xHYUJldE5JVnN0QkVzdXRvaW5CUWlmYzgKNUpGdmpXYVZNcmdrc2RaVnVNWVoxS0dYN2k4KzNDNzRNYzRXdHdJREFRQUJBb0lCQUZZMGp2eWNMVUFOa1k5NQp3YTFvTHorOHR3YjY3aU8xRXdNaUhuUmUvSUF3dHlrcVdqeUpTcGhUby9GZ1ltcjNqSXFVZUVXRFFvaEdYQVFkCkNHS2xqcWZ2dU1yUG5jUWNtSWE4b0ZzTHdaeGt3bnlJdmZJcllpM0JNcStZY0JtRTFEaTZ3RzluZ3U5dG1IemcKaTIzem9pYjVEYlpKOVNNckZKNCtHK1phdHdFSTB2VHBWbENVeDQ5UHRIdzJkWWJhR04xMS8rZnQ1MEJYdytYQgp0ZVpFTjVOYTR0SEhWcHB3aUdFd1BtblhyN292Vmo0eVFzdnhHaEVOTUlrMkNJVkxpQmlhUWhoNTFZYUdnc1AyCmRpeVZRdXF1L2Uyd3cyYzh1c2tlKzN4aW5QdThiY3pJQVZoY3l2RFJlMzFmN0VBOWdYRHU5SDFzQUxrajdXNjYKdjkrRjJhRUNnWUVBLy9Vd3Q1L1lBT3Q1alhIbkRjZ3drbzNSTDlwZUpSUzF3K1BSbEhWV3NmdExZTWx3SERORApwbVRNYmtJUE9yelpqMmJlODcwZm02N3pscGczVXdJbHlmTkhwb0xQL0hRVUp5eS82TWtNbDNhUTQ4MktHM3ovCmdKMDZwQkdGMzZ0Uk1iQ25zN09vOEhZRzNMK0FWRVZ0cnpWc3VnNHBRc21lZ1lCVmNtcnBsRGtDZ1lFQTlsZEoKN3lkUURpL2xjckt1b1JBdEhjdEhwS3Z5VUVVQ1JNMlB3WkY3R3ExVXFoUzFDdGxubDBNNnBDdGIrY25QbWU5SQpZbUZjZCtRZWE3TVpHVXduZmZldUpjeGg0TlI4SjZlZFRTRThpZ3owbG4wdmZ0WnBmcUdLUEtsZE4wakdDdHVvCkZRR0U0cXQ0SXVPNC9Yemlhazd2VlZNbmNJU2JCZlk0VURRUlltOENnWUJ5a0xiTG1mbysveWNiRG42VEJxWG4KRXg4c3doc2RrZFdCNXJqcU1GTXJ1d1VVUDFXMDZhVkFGeUlCd0FPOUVNWjRqMXovMEFrVDBBMHJ2Tm9XaDRHTwprUnZqQmU0K1cxNmg0ai9MM0NHTXNmOU1WN1dYZEMyUXpjOXZuSUJGaXhMK29NbVBmNzBBVkhQaDNyMTcrcytMCmV1ZzlweFVFMWVYaXBTU1o0QXpJMFFLQmdHTEJVWmwzZUNlSDJnTW1VTTJ1NzNkUFJCUm0va2hoc2V3bFFHbEkKU2tMQ2svdHZPN2p5dVEyeDNQTnRrbnpNQTliaFQzSnBONm0wb09GcU5qaW5CL24rN2lpbkMrSVhMUUswdG1IeQpYaE8xNStQZ29jYkdiQnBnNWtzMVZuSlFVVnlPL0k0WFFzK2dFQlJrbUllK3BnSWFUT1kyNU11OXpXd1JiamZ3Cjk3c3ZBb0dBSTYvOEtRdE1ZMWkyenNjUVczL0h2eUxBM0s4N1dUMjdTU3RwUTRCeWhQTmJtYmZvbUpmbXQrZmkKN2NyTXlEdFlUNTVOeW5UOW5QTUJZTXMyT2J5WWdwNjIvZ3daOG03V3luQitRMm1ENUtaYmc5eGwvNzVUeDlzVgpVbVNPRFdib0lUOFlwTDh6WS9mN29VVk0zRnVvZUJqQ1hybkE4S1c4Q082Q2dicjRETGM9Ci0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg=="
    }
  },


  JWT_TEST_USER: {
    iat: Math.round(new Date().getTime() / 1000) - 1,
    exp: Math.round(new Date().getTime() / 1000) + 4 * 3600,
    sub: 'session',
    iss: 'barong',
    aud: [
      'peatio',
      'barong'
    ],
    jti: 'D304AF7134FC22506E06CF93',
    uid: 'ID53B3505544',
    email: 'admin@etorox.io',
    role: 'admin',
    level: 3,
    state: 'active'
  },
  
  
  BARONG_URL: process.env["BARONG_API_URL"] || 'https://account.qa.etorox.io/api/v1',
  BARONG_TEST_USER: {
    "email":"admin@etorox.io",
    "password":"12345678",
    "application_id":"4bf6a778754b0b2dd8b10a94c66511d140cd9a13cec9815ed590092bdab6e0b6"
  },
  
  BARONG_JWT_PRIVATE_KEY: base64.decode(process.env["JWT_SHARED_SECRET_KEY"]),
  BARONG_JWT_PUBLIC_KEY: base64.decode(process.env["JWT_PUBLIC_KEY"]),
}

