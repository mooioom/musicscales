const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));

// Route for all routes that don't end with a file extension
app.get(/^((?!\/?[.]\w+$).)*$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(80, () => {
  console.log('Server started on port 80');
});