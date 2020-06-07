
var authenticate = require('../authenticate');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const mapRouter = express.Router();

mapRouter.use(bodyParser.json());
const Data = require('../models/data');

// {userid : req.user._id}
mapRouter.route('/')
.get(authenticate.verifyUser, (req,res,next) => {
    Data.find({userid : req.user._id})
    .sort({'createdAt': 'desc'})
    .exec(function(err, datas) {
        if(err){
            next(err);
        }
        else{
            res.statusCode = 200;
            console.log(datas);
            res.render('tester2.html',{data: datas});
        }
    })
});
    

module.exports = mapRouter;

