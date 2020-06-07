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
                res.render('create_alert.html',{data: datas});
            }
        })
    })
    .post(authenticate.verifyUser, (req,res,next) => {
        req.body.userid = req.user._id;
        Data.create(req.body)
        .then((data) => {
            res.render('data_form.html',{status:'added'});
        },(err) => {
            res.render('data_form.html',{status:'failed'});
        })
        .catch((err) => {
            res.render('data_form.html',{status:'failed'});
        });
    });

module.exports = alertRouter;



