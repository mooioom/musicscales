const http = require('http');
const config = require('./config.json');

const options = {
  hostname: config.host,
  port: config.port,
  path: '/exe',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

const data = JSON.stringify({
  secretKey: config.secret,
});

req.write(data);
req.end();