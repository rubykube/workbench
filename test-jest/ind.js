const http = require('http');

var options = { protocol: 'http:',
hostname: 'peatio',
port: 8000,
path: '/api/v2/members/me',
method: 'GET',
headers: 
{ Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGJhcm9uZy5pbyIsImlhdCI6MTUyNDA1OTQ1OSwiZXhwIjoxNTI0MDczODU5LCJzdWIiOiJzZXNzaW9uIiwiYXVkIjpbInBlYXRpbyJdLCJsZXZlbCI6MywidWlkIjoiSUQxMjMxMjMiLCJzdGF0ZSI6ImFwcHJvdmVkIn0.bGuzFe2n7OBQATP_3P_J9gZqYJsBAhI65agIsgmtnr6-5YUeOOAmA_JmxhcgYSwg5cUIfvdWAFjZ8OAzYCuO_2H_eVvhWAAv7RFKO_TDXpk-qLYh9z68-gKF9H-exGgiqatiYTZB6LkYTpymFGoIv9otdrQUsoCAHhkquD1JDXDQjreSolXZ8nb1HOmrPD1rF5MDXVt6fVeyrS9-Ir5nsCjPbYGPSCkrsG3_lmnUz9C7Z7eBpaUPxjlvMvdCPM7zl_nbJy43MMJ--S3cUN25LEHxUpCQr20USLSRijfFxwSgduDd7LykRNdkLS20Z92q_3-5Fowf2kKBMgwoBCq-Tw' } }

http.get(options, (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];
    console.log("STATUS---->", statusCode);
  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});