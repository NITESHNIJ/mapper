
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require('cors');


var session = require('express-session');
var FileStore = require('session-file-store')(session);

var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter = require('./routes/dataRouter');
var mapRouter = require('./routes/mapRouter');
var logoutRouter = require('./routes/logoutRouter');
var alertRouter = require('./routes/alertRouter');
var forgotpasswordRouter = require('./routes/forgotpasswordRouter');
var resetpasswordRouter = require('./routes/resetpasswordRouter');
var locationRouter = require('./routes/locationRouter');
var sensorRouter = require('./routes/sensorRouter');
var sensorinstRouter = require('./routes/sensorinstRouter');
var codeRouter = require('./routes/codeRouter');

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

var multer = require('multer');

app.engine('html',require('ejs').renderFile);
app.set('view engine', 'ejs'); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

var cookieParser = require('cookie-parser');
app.use(cookieParser('12345-67890-09876-54321'));


// General ( For all kind of users ): 
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/logout', logoutRouter);
app.use('/forgotpassword', forgotpasswordRouter);
app.use('/resetpassword', resetpasswordRouter);

// For admin user (Company owner) : 
app.use('/data', dataRouter);
// app.use('/dataForm', dataFormRouter);
// app.use('/map', mapRouter);
app.use('/alert', alertRouter);
// app.use('/download', downloadRouter);
app.use('/location',locationRouter);
app.use('/sensor',sensorRouter);
app.use('/sensorinst',sensorinstRouter);
app.use('/code',codeRouter);
//changes
app.use('/custommap',require('./routes/custommapRouter'));


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


