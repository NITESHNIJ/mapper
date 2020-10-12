
var authenticate = require('../authenticate');
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Location = require('../models/location');
var passport = require('passport');

const locationRouter = express.Router();

locationRouter.use(bodyParser.json());

// {userid : req.user._id}
locationRouter.route('/')
    .post(authenticate.verifyUser, (req,res,next) => {
        req.body.userid = req.user._id;
        Location.create({
            userid: req.user._id,
            mapid: req.body.mapid,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            name: req.body.name,
            type: req.body.type
        })
        .then((data) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Location added succesfully'});
        },
        (err) => {
            res.statusCode = 400;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Database Error'});
        })
        .catch((error) => {
            res.statusCode = 400;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Server Error'});
        });
    })
    .get(authenticate.verifyUser, (req,res,next) => {
        var userid;
        if(req.user.usertype == 'admin')
            userid = req.user._id;
        else
            userid = req.user.parentid;

        Location.find({userid : userid})
        .then((data) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Sensor added succesfully', data : data});
        },(err) => {
            res.statusCode = 400;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Database Error'});
        })
        .catch((err) => {
            res.statusCode = 400;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Server Error'});
        });
    });

module.exports = locationRouter;



