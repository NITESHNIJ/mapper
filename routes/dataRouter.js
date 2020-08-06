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
        var userid;
        if(req.user.usertype == 'admin')
            userid = req.user._id;
        else
            userid = req.user.parentid;
        locationid = req.params.locationid;
        
        SensorInst.find({
            userid: userid,
            locationid: locationid
        })
        .then( async (instances) => {
            var i;
            ret = [];
            for(i=0;i<instances.length;i++){
                sensorinstid = instances[i]._id;
                sensorid = instances[i].sensorid;
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
            .then(async (instances) => {
                var i;
                for(i=0;i<instances.length;i++){
                    var sensorinstid = instances[i]._id;
                    var reading = req.body[sensorinstid];

                    var val = await func(reading, instances[i]);
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



function func(reading, instance){
    if(reading != "null" && reading){
        if(instance.alert_users.length>=1){
            Sensor.find({
                _id: instance.sensorid
            })
            .then((sensors) => {
                var sensor = sensors[0];
                if(sensor.data_type == 'continous'){
                    if(reading<sensor.min_range || reading>sensor.max_range){
                        var m;
                        for(m=0;m<instance.alert_users.length;m++){
                            var chooser = instance.alert_users[m];
                            
                            send_mail.send_mail(
                                chooser,
                                "Alert",
                                "Your sensor ( ID : " + instance.sensorid + " ) has given a value : " + reading + " which violating the valid limits"
                            );
                        }
                    }
                }
                else{
                    var flag = true;
                    var k = 0;
                    for(k=0;k<sensor.descrete_values.length;k++){
                        if(sensor.descrete_values[k] == reading){
                            flag = false;
                        }
                    }
                    if(flag){
                        var j;
                        for(j=0;j<instance.alert_users.length;j++){
                            var user = instance.alert_users[j];
                            send_mail.send_mail(
                                user,
                                "Alert",
                                "Your sensor ( ID : " + instance.sensorid + " ) has given a value : " + reading + " which is not among the provided descreate values!"
                            );
                        }
                    }
                }
                return;
            },
            (error) => {
                return error;
            })
            .catch((error) => {
                return error;
            });               
        }
        else
            return;
    }
    else
        return;
}

module.exports = dataRouter;