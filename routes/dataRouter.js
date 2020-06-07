
// var authenticate = require('../authenticate');

// const express = require('express');
// const bodyParser = require('body-parser');

// const mongoose = require('mongoose');
// const Data = require('../models/data');

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
//         Data.create(req.body)
//         .then((data) => {
//             res.render('data_form.html',{status:'added'});
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
        Data.create(req.body)
        .then((data) => {
            res.render('data_form.html',{status:'added'});
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



