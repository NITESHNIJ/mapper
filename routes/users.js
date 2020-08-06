var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');

var send_mail = require('./mail');

var authenticate = require('../authenticate');
const nodemailer = require("nodemailer");

var multer = require('multer');

var router = express.Router();

router.use(bodyParser.json());

var companylogoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/companylogo')
  },
  filename: function (req, file, cb) {
    cb(null, 'anything_for_now' )
  }
});
var companylogoUpload = multer({ storage: companylogoStorage }).single('companylogo');


/* GET users listing. */

router.post('/signup', (req, res, next) => {
  User.register({
    username: req.body.username,
    name: req.body.name,
    companyname: req.body.companyname,
    usertype: req.body.usertype,
    typeofdatabase: req.body.typeofdatabase,
    userpic: req.body.userpic,
    parentid: req.body.parentid
  },
    req.body.password, (err,user) => {
      console.log('ran');
      if(err){
        console.log("I say : " + err.message);
        res.status(401).send(err);
      }
      else{
        passport.authenticate('local')(req, res, () => {
          send_mail.send_mail(req.user.username,"Signed Up!","You have been succesfully signed up");
          
          //shit starts here :

          // console.log("1 : id=> ");
          // console.log(req.user._id);
          // console.log("2 : companylogo=> ");
          // console.log(req.body.companylogo);
          // req.companylogo = req.body.companylogo;
          // companylogoUpload(req, res, function (err) {
          //   if (err instanceof multer.MulterError) {
          //       return res.status(500).json(err)
          //   } else if (err) {
          //       return res.status(500).json(err)
          //   }
          //   console.log("3 : reached");
          //   return res.status(200).send(req.companylogo)
          // })

          // shit ends here











          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({message : 'signup succesful'});
        });
      }
  });
});

router.post('/login',(req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
      res.setHeader('Content-Type','application/json');
      if (err) { 
        res.status(401).send(err);
        return;
      }
      if (!user) { 
        error = {message: 'invalid user'};
        res.status(401).send(error);
        return;
      }
      req.logIn(user, function(err) {
        if (err) { 
          res.status(401).send(err);
          return;
        }
        var token = authenticate.getToken({_id: req.user._id});
        console.log("logged in with token : " + token);
        res.statusCode = 200;
        res.json({
          token : token, 
          message: "logged in succesfully!"
        });
      });
    })(req, res, next);
  });


router.get('/detail',authenticate.verifyUser, (req,res,next) => {
  res.setHeader('Content-Type','application/json');
  res.statusCode = 200;
  res.json({ 
    name: req.user.name,
    companyname: req.user.companyname,
    usertype: req.user.usertype,
    typeofdatabase: req.user.typeofdatabase,
    userpic: req.user.userpic,
    companylogo: req.user.companylogo,
    parentid: req.user.parentid
  });
});

router.post('/localuser/signup',authenticate.verifyUser, (req,res,next) => {
  User.register({
    username: req.body.username,
    name: req.body.name,
    companyname: req.user.companyname,
    usertype: req.body.usertype,
    typeofdatabase: req.user.typeofdatabase,
    userpic: req.body.userpic,
    companylogo: req.user.companylogo,
    parentid: req.user._id

  },
    req.body.password, (err,user) => {
      console.log('ran');
      if(err){
        res.status(401).send(err);
      }
      else{
        passport.authenticate('local')(req, res, () => {
          send_mail.send_mail(req.user.username,"Signed Up!","You have been succesfully signed up");
            
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({message : 'Signup Succesful'});
        });
      }
  });
});

module.exports = router;








