var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('cookie-session');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var auth = require('./routes/auth');
var users = require('./routes/users');
var carpool = require('./routes/carpool');
var groups = require('./routes/groups');

var config = require('./config');
var app = express();


mongoose.connect(process.env.COMPOSE_URI || process.env.MONGOLAB_URI || config.setup.mongo_uri || 'mongodb://localhost/cvgroups');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('less-middleware')(path.join(__dirname, 'public')));

app.use(session({
    name: 'cvgroups:sess',
    secret: config.setup.cookie_secret
}));
app.use(passport.initialize());
app.use(passport.session());


function _requireAuthentication(req, res, next) {
    if (req.user) {
        next();
    }
    else res.status(401).send("User is not logged in.");
}
app.use('/', routes);
app.use('/api/carpool', carpool);
app.use('/api/auth', auth);
app.use('/api/users', _requireAuthentication, users);
app.use('/api/groups',_requireAuthentication, groups);

//route everything else through app
app.get('*', function(req, res) {
    res.render('app');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
