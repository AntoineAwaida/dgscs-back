var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var logger = require('morgan');
var bluebird = require('bluebird');
var mongoose = require('mongoose');


require('./config/passport');

// Connecting to DDB
mongoose.Promise = bluebird
mongoose.connect('mongodb+srv://awaidaantoine:raphael8600A@dgs-avpa0.gcp.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })
.then(()=> { console.log(`Succesfully Connected to the
Mongodb Atlas database!`)})
.catch(()=> { console.log(`Error Connecting to the Mongodb 
Database Atlas database...`)})

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var api = require('./server/routes/api.route');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://cs3.cs-campus.fr');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// API
app.use(passport.initialize());
app.use('/api', api);

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
