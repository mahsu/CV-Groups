"use strict";
var passport = require("passport");
var User = require("../models/user");

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var auth = {};

auth.register = function register(req, res, next) {
    var user = new User({
        //todo add more fields
        username: req.body.username
    });
    console.log(req.body);
    User.register(user, req.body.password, function(err) {
        if (err) {
            //todo handle errors
            console.log("Registration error: ", err);
            return err;
        }
        //todo redirect
        // res.redirect("/user");
    })
};

auth.logout = function logout(req, res, next) {
    req.logout();
    res.redirect('/');
};

module.exports = auth;