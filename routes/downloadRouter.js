
var authenticate = require('../authenticate');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Data = require('../models/data');
var passport = require('passport');

const downloadRouter = express.Router();

downloadRouter.use(bodyParser.json());

// {userid : req.user._id}
downloadRouter.route('/')
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
    });

module.exports = downloadRouter;



