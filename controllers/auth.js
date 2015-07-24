var passport = require("passport");
var User = require("../models/user");

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var auth = {};

auth.register = function register(req, res, next) {
    var point = {type: "Point", coordinates: [parseFloat(req.body.location.lon), parseFloat(req.body.location.lat)]};
    var user = new User({
        //todo add more fields
        email: req.body.username,
        address: req.body.address,
        name: {
            first: req.body.firstname,
            last: req.body.last
        },
        loc: point
    });
    User.register(user, req.body.password, function (err) {
        if (err) {
            //todo handle errors
            console.log("Registration error: ", err);
            res.json(err);
            return err;
        }
        //todo redirect
        res.status(200);
    })
};

auth.logout = function logout(req, res, next) {
    req.logout();
    res.redirect('/');
};

module.exports = auth;