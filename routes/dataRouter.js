// var authenticate = require('../authenticate');

// const express = require('express');
// const bodyParser = require('body-parser');

// const mongoose = require('mongoose');
// const Data = require('../models/data');
// var passport = require('passport');

// const dataRouter = express.Router();

// dataRouter.use(bodyParser.json());

// // {userid : req.user._id}
// dataRouter.route('/')
//     .get(authenticate.verifyUser, (req,res,next) => {
//         Data.find({userid : req.user._id})
//         .sort({'createdAt': 'desc'})
//         .exec(function(err, datas) {
//             if(err){
//                 next(err);
//             }
//             else{
//                 res.statusCode = 200;
//                 res.render('tester2.html',{data: datas});
//             }
//         })
//     })
//     .post(authenticate.verifyUser, (req,res,next) => {
//         req.body.userid = req.user._id;
//         Data.findOne({latitude : req.body.latitude, longitude : req.body.longitude, userid : req.user._id})
//         .then((data) => {
//             if(data != null){
//                 data.level.unshift(req.body.level);
//                 data.temprature.unshift(req.body.temprature);
//                 data.save()
//                 .then((data)=>{
//                     res.render('data_form.html',{status:'added'});
//                 },(err) => res.render('data_form.html',{status:'failed'}));
//             }
//             else{
//                 let temp = req.body.temprature;
//                 let lev = req.body.level;
//                 req.body.temprature = [temp];
//                 req.body.level = [lev];
//                 Data.create(req.body)
//                 .then((data) => {
//                     res.render('data_form.html',{status:'added'});
//                 },(err) => {
//                     res.render('data_form.html',{status:'failed'});
//                 })
//                 .catch((err) => {
//                     res.render('data_form.html',{status:'failed'});
//                 });
//             }
//         },(err) => {
//             res.render('data_form.html',{status:'failed'});
//         })
//         .catch((err) => {
//             res.render('data_form.html',{status:'failed'});
//         });
//     })
//     .put(authenticate.verifyUser, (req,res,next) => {
//         res.statusCode = 403;
//         res.end('PUT operation not supported on /data');
//     })
//     .delete(authenticate.verifyUser, (req,res,next) => {
//         Data.remove({userid : req.user._id})
//         .then((resp) => {
//             res.statusCode = 200;
//             res.setHeader('Content-Type','application/json');
//             res.json(resp);
//         },(err) => next(err))
//         .catch((err) => next(err));
//     });

// module.exports = dataRouter;



var authenticate = require('../authenticate');
const nodemailer = require("nodemailer");

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Data = require('../models/data');
var passport = require('passport');

const dataRouter = express.Router();

dataRouter.use(bodyParser.json());

// {userid : req.user._id}
dataRouter.route('/')
    .get(authenticate.verifyUser, (req,res,next) => {
        Data.find({userid : req.user._id})
        .sort({'createdAt': 'desc'})
        .exec(function(err, datas) {
            if(err){
                next(err);
            }
            else{
                res.statusCode = 200;
                res.render('tester2.html',{data: datas});
            }
        })
    })
    .post(authenticate.verifyUser, (req,res,next) => {
        req.body.userid = req.user._id;
        Data.findOne({latitude : req.body.latitude, longitude : req.body.longitude, userid : req.user._id})
        .then((data) => {
            if(data != null){
                data.level.unshift(req.body.level);
                data.temprature.unshift(req.body.temprature);
                data.save()
                .then((data)=>{

                    if(data.alert == true){
                        if( req.body.level >= data.high  ||  req.body.level <= data.low ){
                            // send mail
                            var str = "";
                            if(req.body.level >= data.high)
                                str = "Level overflow the upper limit for tank = Lat:" + data.latitude + " Lng: " + data.longitude;
                            else
                                str = "Level underflow the lower limit for tank = Lat:" + data.latitude + " Lng: " + data.longitude;

                            let transporter = nodemailer.createTransport({
                                host: "smtp.mailtrap.io",
                                port: 2525,
                                auth: {
                                  user: "8719037746dfd3",
                                  pass: "17fb5449b5864d"
                                },
                              });
                                
                              let info = transporter.sendMail({
                                from: '"nitesh" <niteshnijhawan99@gmail.com>', // sender address
                                to: req.user.username,
                                subject: "Test Email",
                                html: str
                              });

                        }
                    }

                    res.render('data_form.html',{status:'added'});
                },(err) => res.render('data_form.html',{status:'failed'}));
            }
            else{
                let temp = req.body.temprature;
                let lev = req.body.level;
                req.body.temprature = [temp];
                req.body.level = [lev];
                Data.create(req.body)
                .then((data) => {
                    res.render('data_form.html',{status:'added'});
                },(err) => {
                    res.render('data_form.html',{status:'failed'});
                })
                .catch((err) => {
                    res.render('data_form.html',{status:'failed'});
                });
            }
        },(err) => {
            res.render('data_form.html',{status:'failed'});
        })
        .catch((err) => {
            res.render('data_form.html',{status:'failed'});
        });
    })
    .put(authenticate.verifyUser, (req,res,next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /data');
    })
    .delete(authenticate.verifyUser, (req,res,next) => {
        Data.remove({userid : req.user._id})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
        },(err) => next(err))
        .catch((err) => next(err));
    });

module.exports = dataRouter;



