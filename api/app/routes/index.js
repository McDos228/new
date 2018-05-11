const express = require('express');
const app = express();
const index = require('./v1/index');

app.use('/api', index);


module.exports = app;