const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const Users = require('../../services/index').usersService;

router.post('/login', (req, res, next)=>{
    req.checkBody('username').notEmpty().withMessage('username is required')
    .isLength({ min: 4, max: 20 }).withMessage('username must be at least 4 characters');
    req.checkBody('password').notEmpty().withMessage('password is required')
        .matches(/^[A-Za-z0-9_]/, "i").withMessage('the password must contain letters or numbers');
    let errors = req.validationErrors();
    if(errors){
        let errorArray = errors.map(error=>{
            return error.msg;
        });
        return next({message: errorArray.join()});
    }else{
        let user = {username: req.body.username.toLowerCase(), password: req.body.password};
        Users.signIn(user).then(data=>{
            if(data){
                res.json({
                    message:'user successful log in',
                    token: jwt.sign({
                        id: data.id,
                        username: data.username,
                        password: data.password
                    }, config.secret)
                });
            }else{
                res.json({message: 'user not found'});
            }
        });
    }
})

.post('/register', (req, res, next)=>{
    req.checkBody('username').notEmpty().withMessage('username is required')
    .isLength({ min: 4, max: 20 }).withMessage('username must be at least 4 characters');
    req.checkBody('password').notEmpty().withMessage('password is required')
        .matches(/^[A-Za-z0-9_]/, "i").withMessage('the password must contain letters or numbers');
    let errors = req.validationErrors();
    if(errors){
        let errorArray = errors.map(error=>{
            return error.msg;
        });
        return next({message: errorArray.join()});
    }else{
        let user = {username: req.body.username.toLowerCase(), password: req.body.password};
        Users.signUp(user).then(user=>{
            res.json({
                message: "You are successful register",
                user:user.username
            });
        }).catch(err=>{
            res.json({err});
        });
    }
});

module.exports = router;