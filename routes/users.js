var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');

var send_mail = require('./mail');

var authenticate = require('../authenticate');
const nodemailer = require("nodemailer");

var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', (req, res, next) => {
  res.render('signup.ejs',{signedup:'not-tried',error:''});
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}),
    req.body.password, (err,user) => {
      if(err){
        res.render('signup.ejs',{signedup : 'failed', error: err});
      }
      else{
        passport.authenticate('local')(req, res, () => {

          // let transporter = nodemailer.createTransport({
          //   host: 'in-v3.mailjet.com',
          //   port: 587,
          //   secure: false,
          //   auth: {
          //      user: "95f1ac58d3f2730bda0e000b9e4032f0",
          //      pass: "ea71f3d8ffa48b2ebc4396c0b55263b6"
          //   },
          //   debug: false,
          //   logger: true
          // });
            
          // let info = transporter.sendMail({
          //   from: '"nitesh" <95f1ac58d3f2730bda0e000b9e4032f0>', // sender address
          //   to: req.user.username,
          //   subject: "Test Email",
          //   html:"You are registered !"
          // },(err)=>{
          //   if(err){
          //     console.log(err);
          //   }
          // });

          send_mail.send_mail(req.user.username,"Signed Up!","You have been succesfully signed up");
            
          res.render('login.ejs',{signedup : 'passed', loggedin: "not-tried", error:''});
        });
      }
  });
});


router.get('/login', (req, res, next) => {
  res.render('login.ejs',{signedup : 'not-tried', loggedin:'not-tried', error:''});
});

router.post('/login',(req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
      if (err) { res.render('login.ejs',{signedup : 'not-tried', loggedin:'failed', error:err}); }
      if (!user) { res.render('login.ejs',{signedup : 'not-tried', loggedin:'failed', error:'Something went wrong, please try again'}); }
      req.logIn(user, function(err) {
        if (err) { res.render('login.ejs',{signedup : 'not-tried', loggedin:'failed', error:err}); }
        var token = authenticate.getToken({_id: req.user._id});
        res.cookie('token',token.toString(),{maxAge: 3600000, signed: true});
        //res.render('login.ejs',{signedup : 'no-tried', loggedin: "passed", error:''});
        res.redirect('/');
      });
    })(req, res, next);
  });


module.exports = router;








