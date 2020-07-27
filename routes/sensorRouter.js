
var authenticate = require('../authenticate');
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Sensor = require('../models/sensor');
var passport = require('passport');

const sensorRouter = express.Router();

sensorRouter.use(bodyParser.json());

// {userid : req.user._id}
sensorRouter.route('/')
    .post(authenticate.verifyUser, (req,res,next) => {
        console.log(".post reached");
        req.body.userid = req.user._id;
        req.body.descrete_values = req.body.descrete_values.split(/\s+/);
        Sensor.create(
            req.body
        )
        .then((data) => {
            console.log(".then reached");
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Sensor added succesfully'});
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
    })
    .get(authenticate.verifyUser, (req,res,next) => {
        console.log(".get reached");
        Sensor.find({userid : req.user._id})
        .then((data) => {
            console.log(".then reached");
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Sensor added succesfully', data : data});
        },(err) => {
            console.log("err reached");
            res.statusCode = 400;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Database Error'});
        })
        .catch((err) => {
            console.log("error reached");
            res.statusCode = 400;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Server Error'});
        });
    });

module.exports = sensorRouter;



