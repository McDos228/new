const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const validator = require('express-validator');
const app = express();
const routes = require('./api/app/routes/index');

const port  = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use('/', routes);
app.use((err, req, res, next)=>{
	res.status(500).json({
        message: err.message,
        errors: err.errors
    });
});

server.listen(port, ()=>{
	console.log('Server start on port', port);
});

module.exports = app;