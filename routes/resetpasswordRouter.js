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
    Forgot.find({key: req.body.key})
    .then((point) => {
        console.log(point);
        if(point.length){
            if(point[0].username == req.body.username){
                // User.find({username: req.body.username})
                // .then((user) => {
                //     // console.log(user.password);
                //     // res.setHeader('Content-Type','application/json');
                //     // res.statusCode = 200;
                //     // res.json({message : 'found'});
                // },error => {
                //     res.setHeader('Content-Type','application/json');
                //     res.status(401).send(error);
                // })
                // .catch(error => {
                //     res.setHeader('Content-Type','application/json');
                //     res.status(401).send(error);
                // })

                // console.log(point[0].hash);
                // res.setHeader('Content-Type','application/json');
                // res.statusCode = 200;
                // res.json({message : 'found'});
                User.findByUsername(req.body.username).then(function(sanitizedUser){
                    if (sanitizedUser){
                        sanitizedUser.setPassword(req.body.password, function(){
                            sanitizedUser.save();
                            res.status(200).json({message: 'password reset successful'});
                        });
                    } else {
                        res.status(500).json({message: 'This user does not exist'});
                    }
                },function(err){
                    console.error(err);
                });

            }
            else{
                res.setHeader('Content-Type','application/json');
                error = {message: 'Invalid Email ID. The user is not Autherised to this service'};
                res.status(401).send(error);
            }
        }
        else{
            res.setHeader('Content-Type','application/json');
            error = {message: 'Invalid Key. You are not autherized to this service'};
            res.status(401).send(error);
        }
    })
    .catch(error => {
        console.log('Error encountered');
        res.status(401).send(error);
    });
});

module.exports = router;