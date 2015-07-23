"use strict";

const RADIUS_OF_EARTH = 3959;
var carpool = {};

carpool.findNearby = function (req, res, next) {

    var rad = (15 || req.query.rad) / RADIUS_OF_EARTH;

    var user = req.user;
    user.findNearby(rad, function (err, users) {
        if (err) res.status(500).send(err);
        else res.json(users);
    });
};

module.exports = carpool;