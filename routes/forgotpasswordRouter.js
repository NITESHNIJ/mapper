var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var Forgot = require('../models/forgot');
var passport = require('passport');

var send_mail = require('./mail');

var authenticate = require('../authenticate');
const nodemailer = require("nodemailer");

var rand = require("random-key");

var router = express.Router();

router.use(bodyParser.json());

router.post('/',(req, res, next) => {
    User.find({username: req.body.username})
    .then((user) => {
        if(user.length){
            var key = rand.generate(7);
            
            Forgot.create({
                username: req.body.username,
                key: key
            })
            .then((data) => {
                res.setHeader('Content-Type','application/json');
                res.statusCode = 200;
                send_mail.send_mail(req.body.username,"Change Password","https://5ef3879ebab7e0381b74f52a--loving-beaver-54e03f.netlify.app/reset_password/"+key);
                res.json({message : 'Link has been sent to your Mail ID. Please go to it to change the password'});
            },(err) => {
                res.setHeader('Content-Type','application/json');
                error = {message: 'Server Error. Please try after sometime!'};
                res.status(401).send(error);
            })
            .catch((err) => {
                res.setHeader('Content-Type','application/json');
                error = {message: 'Server Error. Please try after sometime!'};
                res.status(401).send(error);
            });
        }
        else{
            res.setHeader('Content-Type','application/json');
            error = {message: 'invalid user'};
            res.status(401).send(error);
        }
    },error => {
        res.setHeader('Content-Type','application/json');
        res.status(401).send(error);
    })
    .catch(error => {
        res.setHeader('Content-Type','application/json');
        res.status(401).send(error);
    });
});


module.exports = router;








