var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');

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

          let transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 465,
            service:'yahoo',
            secure: false,
            auth: {
               user: "niteshnij@yahoo.com",
               pass: "gurmeet@123"
            },
            debug: false,
            logger: true
          });
            
          let info = transporter.sendMail({
            from: '"nitesh" <niteshnijhawan99@gmail.com>', // sender address
            to: req.user.username,
            subject: "Test Email",
            html:"You are registered !"
          },(err)=>{
            if(err){
              console.log(err);
            }
          });
            
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








