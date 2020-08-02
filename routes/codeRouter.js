var authenticate = require('../authenticate');
const nodemailer = require("nodemailer");

const send_mail = require('./mail');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Code = require('../models/code');
const SensorInst = require('../models/sensor_instance');
const Sensor = require('../models/sensor');

const codeRouter = express.Router();

codeRouter.use(bodyParser.json());

codeRouter.route('/:locationid')
.get(authenticate.verifyUser, (req,res,next) => {
    var locationid = req.params.locationid;
    console.log("locationid : " + locationid);
    
    Code.find({
        locationid: locationid
    })
    .then((codes) => {
        console.log("codes : ");
        console.log(codes);
        if(codes.length == 0){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({code:'No sensor available at this position'});
        }
        else{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({code:codes[0].code});
        }
    },
    (error) => {
        res.setHeader('Content-Type','application/json');
        res.status(401).send(error);
    })
    .catch((error) => {
        res.setHeader('Content-Type','application/json');
        res.status(401).send(error);
    });

});


codeRouter.route('/')
.post(async (req,res,next) => {
    var locationid = req.body.locationid;
    console.log("post locationid : " + locationid);

    var code = await sensorinst(locationid);

    if(code == ''){
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({code:'No sensors found at the location'});
    }
    else{

        return Code.find({
            locationid: locationid
        })
        .then((codes) => {
            if(codes.length == 0){
                Code.create({
                    locationid: locationid,
                    code: code
                })
                .then((entity) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json({code:entity.code});
                },
                (error) => {
                    res.setHeader('Content-Type','application/json');
                    res.status(401).send(error);
                })
                .catch((error) => {
                    res.setHeader('Content-Type','application/json');
                    res.status(401).send(error);
                });
            }
            else{
                codes[0].code = code;
                codes[0].save()
                .then((entity) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json({code:entity.code});
                },
                (error) => {
                    res.setHeader('Content-Type','application/json');
                    res.status(401).send(error);
                })
                .catch((error) => {
                    res.setHeader('Content-Type','application/json');
                    res.status(401).send(error);
                });
            }
        },
        (error) => {
            res.setHeader('Content-Type','application/json');
            res.status(401).send(error);
        })
        .catch((error) => {
            res.setHeader('Content-Type','application/json');
            res.status(401).send(error);
        });
    }
});

async function sensorinst(locationid){
    return SensorInst.find({
        locationid: locationid
    })
    .then(async (instances) => {
        if(instances.length == 0)
            return '';
        else{
            var ret = await mapEachSensorInst(instances,locationid);
            return ret;
        }
    },
    (error)=>{
        return '';
    })
    .catch((error) => {
        return '';
    } );
}

async function mapEachSensorInst(instances,locationid){
    var i;
    var global = '{<br>"locationid" : "' + locationid + '",';
    for(i=0;i<instances.length;i++){
        var local;
        if(i==(instances.length-1))
            local = await fillInst(instances[i],true);
        else
            local = await fillInst(instances[i],false);
        global = global + "<br>" + local;
    }
    global+="<br>}";
    return global;
}

function fillInst(instance,flag){
    var info;
    if(flag)
        info = '"' + instance._id + '" :  "[value here]" //';
    else
        info = '"' + instance._id + '" :  "[value here]", //';
    var sensorid = instance.sensorid;

    return Sensor.find({
        _id: sensorid
    })
    .then((sensors) => {
        return (info + " Name : " + sensors[0].name + ", Sensor Type : " + sensors[0].sensor_type + ", Data Type " + sensors[0].data_type);
    },
    (error) => {
        return '';
    })
    .catch((error) => {
        return '';
    });
}

module.exports = codeRouter;