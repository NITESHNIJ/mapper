
var authenticate = require('../authenticate');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const logoutRouter = express.Router();

logoutRouter.use(bodyParser.json());

// {userid : req.user._id}
logoutRouter.route('/')
    .get(authenticate.verifyUser, (req,res,next) => {
        if (!req.user) {
            var err = new Error('You are not logged in!');
            err.status = 403;
            next(err);
          }
          else {
            res.clearCookie('token');
            res.redirect('/');
          }
    });

module.exports = logoutRouter;

