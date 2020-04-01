
'use strict';

const express = require('express');
const app = express();


app.listen(3000);

app.use('/status', (req, res) => {
  res.status(200).send('{status: working}');
});