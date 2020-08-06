var authenticate = require('../authenticate');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Location = require('../models/location');
const SensorInst = require('../models/sensor_instance');
const Sensor = require('../models/sensor');
var passport = require('passport');

const alertRouter = express.Router();

alertRouter.use(bodyParser.json());


function eachInstance(instance,username){
    var inst = {};
    inst.sensorinstid = instance._id;
    inst.checked = false;

    console.log("reached");
    var k;
    for(k=0;k<instance.alert_users.length;k++){
        console.log("stored : " + instance.alert_users[k] + " == username : "+ username);
        console.log("stored : " + typeof instance.alert_users[k] + " == username : "+ typeof username);
        //if( JSON.stringify(instance.alert_users[k]) === JSON.stringify(userid) ){
        if( instance.alert_users[k] === username ){
            console.log("matched");
            inst.checked = true;
        }
    }

    return Sensor.find({
        _id: instance.sensorid
    })
    .then((sensors) => {
        inst.sensorname = sensors[0].name;
        inst.sensor_type = sensors[0].sensor_type;
        inst.data_type = sensors[0].data_type;
        return inst;
    },
    (error) => {
        return {};
    })
    .catch((error) => {
        return {};
    });
    
}

async function eachLocation(location,username){
    var loc = {};
    loc.name = location.name;
    loc.latitude = location.latitude;
    loc.longitude = location.longitude;
    loc.sensinst = [];

    return SensorInst.find({
        locationid : location._id
    })
    .then( async (instances) => {
        var instance = {};
        var j;
        for(j=0;j<instances.length;j++){
            instance = await eachInstance(instances[j],username);
            loc.sensinst.push(instance);
        }
        return loc;
    },
    (error) => {
        return {};
    })
    .catch((error) => {
        return {};
    });

}



alertRouter.route('/')
    .get(authenticate.verifyUser,(req,res,next) => {

        var keyuserid;
        var userid = req.user._id;
        if(req.user.usertype == 'admin')
            keyuserid = req.user._id;
        else
            keyuserid = req.user.parentid;

        Location.find({
            userid: keyuserid
        })
        .then( async (locations) => {
            var i;
            var global = [];
            for(i=0;i<locations.length;i++){
                var local = {};
                local = await eachLocation(locations[i],req.user.username);
                global.push(local);
            }
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({locations:global});
        },
        (error) => {
            res.statusCode = 403;
            res.end('POST operation not supported on /alert');
        })
        .catch((error) => {
            res.statusCode = 403;
            res.end('POST operation not supported on /alert');
        });
        
    })
    .post(authenticate.verifyUser, (req,res,next) => {
        var i;
        var check = req.body.selected;
        console.log("check--");
        console.log(check);
        for(i=0;i<check.length;i++){
            console.log("locationid : " + check[i]);
            SensorInst.findOne({
                _id: check[i]
            })
            .then((instance) => {
                var id = req.user.username;
                instance.alert_users.push(id);
                instance.save()
                .then((instance)=>{
                    
                },(err) => {
                    res.status(404).send(error);
                })
                .catch((error) => {
                    res.status(404).send(error);
                });
            
            },(err) => {
                res.status(404).send(err);
            })
            .catch((err) => {
                res.status(404).send(err);
            });
        }
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({message:'Created Alert Succesfully!'});
        
    });

module.exports = alertRouter;
