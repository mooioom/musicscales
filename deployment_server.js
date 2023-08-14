const express = require('express');
const config = require('./config.json');
const { exec } = require('child_process');

const app = express();
const port = config.port;

app.use(express.json());

app.post('/exe', (req, res) => {
  const { secretKey } = req.body;
  if (secretKey === config.secret) {
    console.log(`deployment_server :: deploying :: ${new Date().toLocaleDateString()}`);
    exec('deploy.bat', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
    res.send('Bat file executed successfully!');
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});