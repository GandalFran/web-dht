
'use strict';

const express = require('express');
const app = express();

app.use('/', (req, res) => {
  res.status(200).send('{status: working}');
});

app.listen(3000);