
var authenticate = require('../authenticate');
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Sensor_Inst = require('../models/sensor_instance');
var passport = require('passport');

const sensorinstRouter = express.Router();

sensorinstRouter.use(bodyParser.json());

sensorinstRouter.route('/')
    .post(authenticate.verifyUser, (req,res,next) => {
        var i=0;
        for(i=0;i<Number(req.body.count);i++){
            Sensor_Inst.create({
                userid: req.user._id,
                locationid: req.body.locationid,
                sensorid: req.body.sensorid
            })
            .then((data) => {

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
        }

        if(i == Number(req.body.count)){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Sensors installed succesfully'});
        }

    });

module.exports = sensorinstRouter;



