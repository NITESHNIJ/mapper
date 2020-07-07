
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
        console.log(".post reached");
        req.body.userid = req.user._id;
        Location.create({
            userid: req.user._id,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            name: req.body.name
        })
        .then((data) => {
            console.log(".then reached");
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Location added succesfully'});
        },
        (err) => {
            console.log("err reached");
            res.statusCode = 400;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Database Error'});
        })
        .catch((error) => {
            console.log("error reached");
            res.statusCode = 400;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Server Error'});
        });
    });

module.exports = locationRouter;



