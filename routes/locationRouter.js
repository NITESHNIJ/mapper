
var authenticate = require('../authenticate');
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Location = require('../models/location');
var passport = require('passport');
const Maps = require('../models/custom_map');

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
    });


function loc_name(mapid){
    return Maps.find({_id : mapid})
    .then((map) => {
        return map[0].name;
    },(err) => {
        return 'no name found';
    })
    .catch((err) => {
        return 'no name found';
    });
}


locationRouter.route('/')
    .get(authenticate.verifyUser, (req,res,next) => {
        console.log("reached 1a");
        var userid;
        if(req.user.usertype == 'admin')
            userid = req.user._id;
        else
            userid = req.user.parentid;

        console.log("reached 1b");

        Location.find({userid : userid}).lean()
        .then(async (locations) => {
            console.log("reached 1c");

            var i;
            for(i=0;i<locations.length;i++){
                console.log(locations[i]);
                locations[i].map_name = "nitesh";
                if(locations[i]['mapid'] == 'global')
                    locations[i].map_name = "global";
                else
                    locations[i]['map_name'] = await loc_name(locations[i]['mapid']);
            }

            console.log(locations);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Sensor added succesfully', data : locations});
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


locationRouter.route('/:mapid')
    .get(authenticate.verifyUser, (req,res,next) => {
        var mapid = req.params.mapid;
        var userid;
        if(req.user.usertype == 'admin')
            userid = req.user._id;
        else
            userid = req.user.parentid;

        Location.find({userid : userid, mapid : mapid})
        .then((locations) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({message : 'Sensor added succesfully', data : locations});
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



