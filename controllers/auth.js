var passport = require("passport");
var User = require("../models/user");
var _ = require("underscore");

var OMIT = "salt hash last attempts";
// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(function(username, callback) {
        User.findByUsername(username, function(err, user) {
            if (err) return callback(err);
            user = _.omit(user, OMIT); // remove properties not required
            callback(null, user);
        });
    }
);

var auth = {};

auth.register = function register(req, res, next) {
    var point = {type: "Point", coordinates: [parseFloat(req.body.loc.lon), parseFloat(req.body.loc.lat)]};
    var user = new User({
        //todo add more fields
        email: req.body.email,
        address: req.body.address,
        name: {
            first: req.body.firstname,
            last: req.body.last
        },
        loc: point
    });
    User.register(user, req.body.password, function (err, user) {
        if (err) {
            //todo handle errors
            console.log("Registration error: ", err);
            res.json(err);
            return res.send(500);
        }
        return res.send(200);
    })
};

auth.login = function(req, res, next) {
    passport.authenticate('local', function(err, user) {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        if (!user) {
            return res.sendStatus(403);
        }
        req.logIn(user, function(err) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.sendStatus(200);
        })
    })(req, res, next);
};


auth.logout = function logout(req, res, next) {
    req.logout();
    res.redirect('/');
};

module.exports = auth;