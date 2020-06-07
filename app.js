
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter = require('./routes/dataRouter');
var dataFormRouter = require('./routes/dataFormRouter');
var mapRouter = require('./routes/mapRouter');
var logoutRouter = require('./routes/logoutRouter');
var alertRouter = require('./routes/alertRouter');

// creating connection to the database mongo server and schemas.
const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Succesfully connected to mongo server');
}, (err) => {
  console.log(err);
});


var app = express();


app.engine('html',require('ejs').renderFile);
app.set('view engine', 'ejs'); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

var cookieParser = require('cookie-parser');
app.use(cookieParser('12345-67890-09876-54321'));

function auth(req,res,next){
    console.log(req.signedCookies);
    if(req.signedCookies.token){
      req.headers['authorization'] = `Bearer ${req.signedCookies.token}`;
    }
    next();
  }
  
app.use(auth);



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/data', dataRouter);
app.use('/dataForm', dataFormRouter);
app.use('/map', mapRouter);
app.use('/logout', logoutRouter);
app.use('/create_alert', alertRouter);

app.use(express.static(path.join(__dirname, 'public')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


