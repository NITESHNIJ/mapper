
var authenticate = require('../authenticate');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const dataFormRouter = express.Router();

dataFormRouter.use(bodyParser.json());

// {userid : req.user._id}
dataFormRouter.route('/')
    .get(authenticate.verifyUser, (req,res,next) => {
        res.render('data_form.html',{status:'not_tried'});
    });
    

module.exports = dataFormRouter;

