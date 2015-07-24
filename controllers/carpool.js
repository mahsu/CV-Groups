"use strict";

var RADIUS_OF_EARTH = 3959;
var carpool = {};
var User = require('../models/user');
carpool.findNearby = function (req, res, next) {

    console.log("in findNearby");

    var rad = (15 || req.query.rad) / RADIUS_OF_EARTH;

    var user = req.user;

    console.log(req.user);
    User.findNearby(user, rad, function (err, users) {
        if (err) res.status(500).send(err);
        else res.json(users);
    });
};

module.exports = carpool;