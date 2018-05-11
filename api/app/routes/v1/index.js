const express = require('express');
const app = express();
const todos = require('./todos');
const users = require('./users');
const jwt = require('jsonwebtoken');

loginRequired = (req, res, next)=> {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({message: 'Unauthorized user!'});
    }
};

app.use('/user', users);

app.use((req,res,next)=>{
    if(req.headers && req.headers.authorization){
        jwt.verify(req.headers.authorization, 'secret', (err, decode)=>{
            if(err) req.user = undefined;
                req.user = decode;
                next();
        });
    }else {
        req.user = undefined;
        next();
    }
});

app.use('/todos', loginRequired, todos);

module.exports = app;
