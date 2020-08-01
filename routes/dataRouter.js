var authenticate = require('../authenticate');
const nodemailer = require("nodemailer");

const send_mail = require('./mail');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Data = require('../models/data');
const Location = require('../models/location');
const SensorInst = require('../models/sensor_instance');
const Sensor = require('../models/sensor');
var passport = require('passport');

const dataRouter = express.Router();

dataRouter.use(bodyParser.json());

function sensor_info(sensorid){
    return Sensor.find({
        _id: sensorid
    })
    .then((sensor) => {
        return sensor;
    },
    (error) => {
        return {};
    })
    .catch((error) => {
        return {};
    });
}

function trial(sensorinstid,sensorid){
    obj = {};
    return Data.find({sensorinstid: sensorinstid})
    .sort({'createdAt': 'desc'})
    .then(async (datas) => {
        if(datas.length != 0){
            console.log("datas : " + datas);
            // obj = {};
            obj.sensorinstid = sensorinstid;
            obj.readings = [];
            var j;
            for(j=0;j<datas.length;j++)
                obj.readings.push(datas[j].reading);
            obj.sensor = await sensor_info(sensorid);
            return obj;
        }
        else
            return {};
    },
    (error) => {
        return {};
    })
    .catch((error) => {
        return {};
    });
}

dataRouter.route('/:locationid')
    .get(authenticate.verifyUser, (req,res,next) => {
        userid = req.user._id;
        locationid = req.params.locationid;
        console.log("userid : " + userid + " locationid : " + locationid);
        
        SensorInst.find({
            userid: userid,
            locationid: locationid
        })
        .then( async (instances) => {
            console.log("instances : ");
            console.log(instances);
            var i;
            ret = [];
            console.log("Oop Begins ------------------------------");
            for(i=0;i<instances.length;i++){
                sensorinstid = instances[i]._id;
                sensorid = instances[i].sensorid;
                console.log("sensorinst : " + sensorinstid);
                obj = await trial(sensorinstid,sensorid);
                ret.push(obj);
            }
            if(i == instances.length){
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json({ret:ret});
            }
        },
        (error) => {
            res.status(404).send(error);
        })
        .catch((error) => {
            res.status(404).send(error);
        });

    });
dataRouter.route('/').post((req,res,next) => {
        var locationid = req.body.locationid;
        Location.find({
            _id : locationid
        })
        .then((location) => {
            var userid = location[0].userid;

            SensorInst.find({
                userid: userid,
                locationid: locationid
            })
            .then((instances) => {
                console.log("userid : " + userid + " locationid : " + locationid);
                var i;
                var ids = [];
                var readings = [];
                for(i=0;i<instances.length;i++){
                    sensorinstid = instances[i]._id;
                    ids.push(sensorinstid);
                    reading = req.body[sensorinstid];
                    readings.push(reading);

                    Data.create({
                        sensorinstid: sensorinstid,
                        reading: reading
                    })
                    .then(() => {

                    },
                    (error) => {
                        res.status(404).send(error);
                    })
                    .catch((error) => {
                        res.status(404).send(error);
                    });
                }
                if(i == instances.length){
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json({message:'success'});
                }
            },
            (error) => {
                res.status(404).send(error);
            })
            .catch((error) => {
                res.status(404).send(error);
            });
        },
        (error) => {
            res.status(404).send(error);
        })
        .catch((error) => {
            res.status(404).send(error);
        });
    })
    .put((req,res,next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /data');
    })
    .delete((req,res,next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /data');
    });

module.exports = dataRouter;



