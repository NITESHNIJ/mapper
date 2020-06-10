var authenticate = require('../authenticate');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Data = require('../models/data');
var passport = require('passport');

const alertRouter = express.Router();

alertRouter.use(bodyParser.json());

alertRouter.route('/')
    .get(authenticate.verifyUser, (req,res,next) => {
        Data.find({userid : req.user._id})
        .sort({'createdAt': 'desc'})
        .exec(function(err, datas) {
            if(err){
                next(err);
            }
            else{
                res.statusCode = 200;
                res.render('create_alert.html',{data: datas, status: 'not-tried'});
            }
        })
    })
    .post(authenticate.verifyUser, (req,res,next) => {
        req.body.userid = req.user._id;
        check = req.body.check;
        if((typeof check) != Object)
            check = [check];
        var i;
        for(i=0;i<check.length;i++){
            var latlng = check[i].split('_');
            var lat = latlng[0];
            var lng = latlng[1];
            console.log("lat : " + lat + " Lng : " + lng);

            Data.findOne({latitude : lat, longitude : lng, userid : req.user._id})
            .then((data) => {
                data.alert = true;
                data.high = req.body.high;
                data.low = req.body.low;
                data.save()
                .then((data)=>{
                    
                },(err) => {
                    console.log(err);
                    res.render('create_alert.html',{status:'failed', data: []});
                });
            
            },(err) => {
                console.log(err);
                res.render('create_alert.html',{status:'failed', data: []});
            })
            .catch((err) => {
                console.log(err);
                res.render('create_alert.html',{status:'failed', data: []});
            });

        }
        if(i == check.length){
            Data.find({userid : req.user._id})
            .sort({'createdAt': 'desc'})
            .exec(function(err, datas) {
                if(err){
                    console.log(err);
                    next(err);
                }
                else{
                    res.statusCode = 200;
                    //res.render('create_alert.html',{data: datas, status: 'passed'});
                    res.redirect('/create_alert');
                }
            })
        }
    });

module.exports = alertRouter;
